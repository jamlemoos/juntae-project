package service

import (
	"fmt"
	"log"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"

	"github.com/google/uuid"
)

type ProjectRoleService struct {
	repo        *repository.ProjectRoleRepository
	projectRepo *repository.ProjectRepository
	audit       *AuditService
}

func NewProjectRoleService(
	repo *repository.ProjectRoleRepository,
	projectRepo *repository.ProjectRepository,
	audit *AuditService,
) *ProjectRoleService {
	return &ProjectRoleService{repo: repo, projectRepo: projectRepo, audit: audit}
}

func (s *ProjectRoleService) CreateProjectRole(callerID uuid.UUID, req dto.CreateProjectRoleRequest) (*dto.ProjectRoleResponse, error) {
	project, err := s.projectRepo.FindByID(req.ProjectID)
	if err != nil {
		return nil, fmt.Errorf("project not found: %w", err)
	}
	if project.CreatorID != callerID {
		return nil, ErrForbidden
	}
	role := &model.ProjectRole{
		Title:       req.Title,
		Description: req.Description,
		Status:      req.Status,
		ProjectID:   req.ProjectID,
	}
	if err := s.repo.Create(role); err != nil {
		return nil, fmt.Errorf("create project role: %w", err)
	}
	if err := s.audit.LogCreate("ProjectRole", role.ID, fmt.Sprintf("ProjectRole created: %s", role.Title)); err != nil {
		log.Printf("WARN: audit log failed for project role create %s: %v", role.ID, err)
	}
	resp := mapProjectRoleResponse(role, callerID)
	return &resp, nil
}

func (s *ProjectRoleService) GetProjectRoles(callerID uuid.UUID) ([]dto.ProjectRoleResponse, error) {
	roles, err := s.repo.FindAllWithApplications()
	if err != nil {
		return nil, fmt.Errorf("get project roles: %w", err)
	}
	responses := make([]dto.ProjectRoleResponse, len(roles))
	for i := range roles {
		responses[i] = mapProjectRoleResponse(&roles[i], callerID)
	}
	return responses, nil
}

func (s *ProjectRoleService) GetProjectRolesByProject(projectID uuid.UUID, callerID uuid.UUID) ([]dto.ProjectRoleResponse, error) {
	project, err := s.projectRepo.FindByID(projectID)
	if err != nil {
		return nil, fmt.Errorf("project not found: %w", err)
	}

	// Short-circuit: non-owners get no roles when the project is not OPEN.
	if project.CreatorID != callerID && project.Status != "OPEN" {
		return []dto.ProjectRoleResponse{}, nil
	}

	roles, err := s.repo.FindByProjectIDWithApplications(projectID)
	if err != nil {
		return nil, fmt.Errorf("get project roles: %w", err)
	}

	visible := filterVisibleProjectRoles(project, roles, callerID)
	responses := make([]dto.ProjectRoleResponse, len(visible))
	for i := range visible {
		responses[i] = mapProjectRoleResponse(&visible[i], callerID)
	}
	return responses, nil
}

func (s *ProjectRoleService) GetProjectRoleByID(id uuid.UUID, callerID uuid.UUID) (*dto.ProjectRoleResponse, error) {
	role, err := s.repo.FindByIDWithApplications(id)
	if err != nil {
		return nil, fmt.Errorf("get project role: %w", err)
	}
	resp := mapProjectRoleResponse(role, callerID)
	return &resp, nil
}

func (s *ProjectRoleService) UpdateProjectRole(id uuid.UUID, callerID uuid.UUID, req dto.UpdateProjectRoleRequest) (*dto.ProjectRoleResponse, error) {
	role, err := s.repo.FindWithProject(id)
	if err != nil {
		return nil, fmt.Errorf("project role not found: %w", err)
	}
	if role.Project.CreatorID != callerID {
		return nil, ErrForbidden
	}
	role.Title = req.Title
	role.Description = req.Description
	role.Status = req.Status
	if err := s.repo.Update(role); err != nil {
		return nil, fmt.Errorf("update project role: %w", err)
	}
	updated, err := s.repo.FindByIDWithApplications(id)
	if err != nil {
		return nil, fmt.Errorf("reload project role: %w", err)
	}
	resp := mapProjectRoleResponse(updated, callerID)
	return &resp, nil
}

func (s *ProjectRoleService) DeleteProjectRole(id uuid.UUID, callerID uuid.UUID) error {
	role, err := s.repo.FindWithProject(id)
	if err != nil {
		return fmt.Errorf("project role not found: %w", err)
	}
	if role.Project.CreatorID != callerID {
		return ErrForbidden
	}
	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("delete project role: %w", err)
	}
	return nil
}

func mapProjectRoleResponse(r *model.ProjectRole, callerID uuid.UUID) dto.ProjectRoleResponse {
	var hasApplied bool
	for i := range r.Applications {
		if r.Applications[i].UserID == callerID {
			hasApplied = true
			break
		}
	}
	return dto.ProjectRoleResponse{
		ID:                r.ID,
		Title:             r.Title,
		Description:       r.Description,
		Status:            r.Status,
		ProjectID:         r.ProjectID,
		ApplicationsCount: int64(len(r.Applications)),
		HasApplied:        hasApplied,
		CreatedAt:         r.CreatedAt,
		UpdatedAt:         r.UpdatedAt,
	}
}
