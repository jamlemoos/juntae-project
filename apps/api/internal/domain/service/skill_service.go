package service

import (
	"fmt"

	"github.com/google/uuid"
	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"
)

type SkillService struct {
	repo  *repository.SkillRepository
	audit *AuditService
}

func NewSkillService(repo *repository.SkillRepository, audit *AuditService) *SkillService {
	return &SkillService{repo: repo, audit: audit}
}

func (s *SkillService) CreateSkill(req dto.CreateSkillRequest) (*dto.SkillResponse, error) {
	skill := &model.Skill{Name: req.Name}
	if err := s.repo.Create(skill); err != nil {
		return nil, fmt.Errorf("create skill: %w", err)
	}
	if err := s.audit.LogCreate("Skill", skill.ID, fmt.Sprintf("Skill created: %s", skill.Name)); err != nil {
		return nil, fmt.Errorf("audit skill create: %w", err)
	}
	resp := mapSkillResponse(skill)
	return &resp, nil
}

func (s *SkillService) GetSkills() ([]dto.SkillResponse, error) {
	skills, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("get skills: %w", err)
	}
	responses := make([]dto.SkillResponse, len(skills))
	for i := range skills {
		responses[i] = mapSkillResponse(&skills[i])
	}
	return responses, nil
}

func (s *SkillService) GetSkillByID(id uuid.UUID) (*dto.SkillResponse, error) {
	skill, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("get skill: %w", err)
	}
	resp := mapSkillResponse(skill)
	return &resp, nil
}

func (s *SkillService) UpdateSkill(id uuid.UUID, req dto.UpdateSkillRequest) (*dto.SkillResponse, error) {
	skill, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("skill not found: %w", err)
	}
	skill.Name = req.Name
	if err := s.repo.Update(skill); err != nil {
		return nil, fmt.Errorf("update skill: %w", err)
	}
	resp := mapSkillResponse(skill)
	return &resp, nil
}

func (s *SkillService) DeleteSkill(id uuid.UUID) error {
	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("delete skill: %w", err)
	}
	return nil
}

func mapSkillResponse(s *model.Skill) dto.SkillResponse {
	return dto.SkillResponse{
		ID:        s.ID,
		Name:      s.Name,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
	}
}
