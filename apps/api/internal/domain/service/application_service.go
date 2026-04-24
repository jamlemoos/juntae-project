package service

import (
	"fmt"

	"github.com/google/uuid"
	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"
)

type ApplicationService struct {
	repo  *repository.ApplicationRepository
	audit *AuditService
}

func NewApplicationService(repo *repository.ApplicationRepository, audit *AuditService) *ApplicationService {
	return &ApplicationService{repo: repo, audit: audit}
}

func (s *ApplicationService) CreateApplication(req dto.CreateApplicationRequest) (*dto.ApplicationResponse, error) {
	application := &model.Application{
		Message:       req.Message,
		Status:        req.Status,
		UserID:        req.UserID,
		ProjectRoleID: req.ProjectRoleID,
	}
	if err := s.repo.Create(application); err != nil {
		return nil, fmt.Errorf("create application: %w", err)
	}
	if err := s.audit.LogCreate("Application", application.ID, fmt.Sprintf("Application created by user %s", application.UserID)); err != nil {
		return nil, fmt.Errorf("audit application create: %w", err)
	}
	resp := mapApplicationResponse(application)
	return &resp, nil
}

func (s *ApplicationService) GetApplications() ([]dto.ApplicationResponse, error) {
	applications, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("get applications: %w", err)
	}
	responses := make([]dto.ApplicationResponse, len(applications))
	for i := range applications {
		responses[i] = mapApplicationResponse(&applications[i])
	}
	return responses, nil
}

func (s *ApplicationService) GetApplicationByID(id uuid.UUID) (*dto.ApplicationResponse, error) {
	application, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("get application: %w", err)
	}
	resp := mapApplicationResponse(application)
	return &resp, nil
}

func (s *ApplicationService) UpdateApplication(id uuid.UUID, req dto.UpdateApplicationRequest) (*dto.ApplicationResponse, error) {
	application, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("application not found: %w", err)
	}
	application.Message = req.Message
	application.Status = req.Status
	if err := s.repo.Update(application); err != nil {
		return nil, fmt.Errorf("update application: %w", err)
	}
	resp := mapApplicationResponse(application)
	return &resp, nil
}

func (s *ApplicationService) DeleteApplication(id uuid.UUID) error {
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
