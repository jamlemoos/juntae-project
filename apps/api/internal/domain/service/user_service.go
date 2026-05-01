package service

import (
	"errors"
	"fmt"
	"log"
	"strings"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"
	"juntae-api/internal/security"

	"gorm.io/gorm"

	"github.com/google/uuid"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type UserService struct {
	repo      *repository.UserRepository
	skillRepo *repository.SkillRepository
	audit     *AuditService
}

func NewUserService(repo *repository.UserRepository, skillRepo *repository.SkillRepository, audit *AuditService) *UserService {
	return &UserService{repo: repo, skillRepo: skillRepo, audit: audit}
}

func (s *UserService) CreateUser(req dto.CreateUserRequest) (*dto.UserResponse, error) {
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	hashedPassword, err := security.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}
	user := &model.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: &hashedPassword,
		Role:     "member",
		Bio:      req.Bio,
		City:     req.City,
	}
	if len(req.SkillIDs) > 0 {
		skills, err := s.skillRepo.FindByIDs(req.SkillIDs)
		if err != nil {
			return nil, fmt.Errorf("load skills: %w", err)
		}
		user.Skills = skills
	}
	if err := s.repo.Create(user); err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}
	if err := s.audit.LogCreate("User", user.ID, fmt.Sprintf("User created: %s", user.Email)); err != nil {
		log.Printf("WARN: audit log failed for user create %s: %v", user.ID, err)
	}
	resp := mapUserResponse(user)
	return &resp, nil
}

func (s *UserService) GetUsers() ([]dto.PublicUserResponse, error) {
	users, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("get users: %w", err)
	}
	responses := make([]dto.PublicUserResponse, len(users))
	for i := range users {
		responses[i] = mapPublicUserResponse(&users[i])
	}
	return responses, nil
}

func (s *UserService) GetUserByID(id uuid.UUID) (*dto.UserResponse, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}
	resp := mapUserResponse(user)
	return &resp, nil
}

func (s *UserService) GetPublicUserByID(id uuid.UUID) (*dto.PublicUserResponse, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("get user: %w", err)
	}
	resp := mapPublicUserResponse(user)
	return &resp, nil
}

func (s *UserService) UpdateUser(id uuid.UUID, callerID uuid.UUID, req dto.UpdateUserRequest) (*dto.UserResponse, error) {
	if id != callerID {
		return nil, ErrForbidden
	}
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}
	user.Name = req.Name
	user.Email = strings.ToLower(strings.TrimSpace(req.Email))
	user.Bio = req.Bio
	user.City = req.City

	if len(req.SkillIDs) > 0 {
		skills, err := s.skillRepo.FindByIDs(req.SkillIDs)
		if err != nil {
			return nil, fmt.Errorf("load skills: %w", err)
		}
		if err := s.repo.ReplaceSkills(user, skills); err != nil {
			return nil, fmt.Errorf("replace skills: %w", err)
		}
		user.Skills = skills
	}
	if err := s.repo.Update(user); err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	if err := s.audit.LogAction("UPDATE", "User", user.ID, fmt.Sprintf("User updated profile: %s", user.Email)); err != nil {
		log.Printf("WARN: audit log failed for user update %s: %v", user.ID, err)
	}

	resp := mapUserResponse(user)
	return &resp, nil
}

func (s *UserService) DeleteUser(id uuid.UUID, callerID uuid.UUID) error {
	if id != callerID {
		return ErrForbidden
	}
	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("delete user: %w", err)
	}
	return nil
}

func (s *UserService) Login(email, password string) (string, *dto.UserResponse, error) {
	normalizedEmail := strings.ToLower(strings.TrimSpace(email))
	user, err := s.repo.FindByEmail(normalizedEmail)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil, ErrInvalidCredentials
		}
		return "", nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	if user.Password == nil {
		return "", nil, ErrInvalidCredentials
	}

	isValid, err := security.CheckPasswordHash(password, *user.Password)
	if err != nil {
		return "", nil, fmt.Errorf("check password hash: %w", err)
	}
	if !isValid {
		return "", nil, ErrInvalidCredentials
	}

	token, err := security.GenerateToken(user.ID, user.Role)
	if err != nil {
		return "", nil, fmt.Errorf("generate token: %w", err)
	}

	if err := s.audit.LogAction("LOGIN", "User", user.ID, fmt.Sprintf("User logged in: %s", user.Email)); err != nil {
		log.Printf("WARN: audit log failed for user %s: %v", user.ID, err)
	}

	resp := mapUserResponse(user)
	return token, &resp, nil
}

func mapUserResponse(u *model.User) dto.UserResponse {
	skills := make([]dto.SkillResponse, len(u.Skills))
	for i := range u.Skills {
		skills[i] = mapSkillResponse(&u.Skills[i])
	}
	return dto.UserResponse{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Role:      u.Role,
		Bio:       u.Bio,
		City:      u.City,
		Skills:    skills,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}
