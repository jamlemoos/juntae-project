package service

import (
	"fmt"
	"log"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"

	"github.com/google/uuid"
)

type ApplicationService struct {
	repo     *repository.ApplicationRepository
	roleRepo *repository.ProjectRoleRepository
	audit    *AuditService
}

func NewApplicationService(
	repo *repository.ApplicationRepository,
	roleRepo *repository.ProjectRoleRepository,
	audit *AuditService,
) *ApplicationService {
	return &ApplicationService{repo: repo, roleRepo: roleRepo, audit: audit}
}

func (s *ApplicationService) CreateApplication(userID uuid.UUID, req dto.CreateApplicationRequest) (*dto.ApplicationResponse, error) {
	role, err := s.roleRepo.FindWithProject(req.ProjectRoleID)
	if err != nil {
		return nil, fmt.Errorf("project role not found: %w", err)
	}
	if role.Project.CreatorID == userID {
		return nil, ErrForbidden
	}
	exists, err := s.repo.ExistsByUserAndRole(userID, req.ProjectRoleID)
	if err != nil {
		return nil, fmt.Errorf("check duplicate application: %w", err)
	}
	if exists {
		return nil, ErrConflict
	}
	application := &model.Application{
		Message:       req.Message,
		Status:        "PENDING",
		UserID:        userID,
		ProjectRoleID: req.ProjectRoleID,
	}
	if err := s.repo.Create(application); err != nil {
		if isUniqueViolation(err) {
			return nil, ErrConflict
		}
		return nil, fmt.Errorf("create application: %w", err)
	}
	if err := s.audit.LogCreate("Application", application.ID, fmt.Sprintf("Application created by user %s", application.UserID)); err != nil {
		log.Printf("WARN: audit log failed for application create %s: %v", application.ID, err)
	}
	resp := mapApplicationResponse(application)
	return &resp, nil
}

func (s *ApplicationService) GetMyApplications(callerID uuid.UUID) ([]dto.ApplicationResponse, error) {
	applications, err := s.repo.FindByUserID(callerID)
	if err != nil {
		return nil, fmt.Errorf("get applications: %w", err)
	}
	responses := make([]dto.ApplicationResponse, len(applications))
	for i := range applications {
		responses[i] = mapApplicationResponse(&applications[i])
	}
	return responses, nil
}

func (s *ApplicationService) GetApplicationByID(id uuid.UUID, callerID uuid.UUID) (*dto.ApplicationResponse, error) {
	application, err := s.repo.FindWithProjectChain(id)
	if err != nil {
		return nil, fmt.Errorf("get application: %w", err)
	}
	if application.UserID != callerID && application.ProjectRole.Project.CreatorID != callerID {
		return nil, ErrForbidden
	}
	resp := mapApplicationResponse(application)
	return &resp, nil
}

func (s *ApplicationService) UpdateApplication(id uuid.UUID, callerID uuid.UUID, req dto.UpdateApplicationRequest) (*dto.ApplicationResponse, error) {
	application, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("application not found: %w", err)
	}
	if application.UserID != callerID {
		return nil, ErrForbidden
	}
	application.Message = req.Message
	if err := s.repo.Update(application); err != nil {
		return nil, fmt.Errorf("update application: %w", err)
	}
	resp := mapApplicationResponse(application)
	return &resp, nil
}

func (s *ApplicationService) UpdateApplicationStatus(id uuid.UUID, callerID uuid.UUID, status string) (*dto.ApplicationResponse, error) {
	application, err := s.repo.FindWithProjectChain(id)
	if err != nil {
		return nil, fmt.Errorf("application not found: %w", err)
	}
	if application.ProjectRole.Project.CreatorID != callerID {
		return nil, ErrForbidden
	}
	application.Status = status
	if err := s.repo.Update(application); err != nil {
		return nil, fmt.Errorf("update application status: %w", err)
	}
	resp := mapApplicationResponse(application)
	return &resp, nil
}

func (s *ApplicationService) DeleteApplication(id uuid.UUID, callerID uuid.UUID) error {
	application, err := s.repo.FindByID(id)
	if err != nil {
		return fmt.Errorf("application not found: %w", err)
	}
	if application.UserID != callerID {
		return ErrForbidden
	}
	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("delete application: %w", err)
	}
	return nil
}

func mapApplicationResponse(a *model.Application) dto.ApplicationResponse {
	return dto.ApplicationResponse{
		ID:            a.ID,
		Message:       a.Message,
		Status:        a.Status,
		UserID:        a.UserID,
		ProjectRoleID: a.ProjectRoleID,
		CreatedAt:     a.CreatedAt,
		UpdatedAt:     a.UpdatedAt,
	}
}

func mapApplicationDetailResponse(a *model.Application) dto.ApplicationDetailResponse {
	return dto.ApplicationDetailResponse{
		ID:            a.ID,
		Message:       a.Message,
		Status:        a.Status,
		User:          mapPublicUserResponse(&a.User),
		ProjectRoleID: a.ProjectRoleID,
		RoleTitle:     a.ProjectRole.Title,
		CreatedAt:     a.CreatedAt,
		UpdatedAt:     a.UpdatedAt,
	}
}
