package service

import (
	"fmt"

	"github.com/google/uuid"
	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"
)

type ProjectService struct {
	repo  *repository.ProjectRepository
	audit *AuditService
}

func NewProjectService(repo *repository.ProjectRepository, audit *AuditService) *ProjectService {
	return &ProjectService{repo: repo, audit: audit}
}

func (s *ProjectService) CreateProject(req dto.CreateProjectRequest) (*dto.ProjectResponse, error) {
	roles := make([]model.ProjectRole, len(req.Roles))
	for i, r := range req.Roles {
		roles[i] = model.ProjectRole{
			Title:       r.Title,
			Description: r.Description,
			Status:      r.Status,
		}
	}
	project := &model.Project{
		Title:       req.Title,
		Description: req.Description,
		Status:      req.Status,
		CreatorID:   req.CreatorID,
		Roles:       roles,
	}
	if err := s.repo.Create(project); err != nil {
		return nil, fmt.Errorf("create project: %w", err)
	}
	if err := s.audit.LogCreate("Project", project.ID, fmt.Sprintf("Project created: %s", project.Title)); err != nil {
		return nil, fmt.Errorf("audit project create: %w", err)
	}
	resp := mapProjectResponse(project)
	return &resp, nil
}

func (s *ProjectService) GetProjects() ([]dto.ProjectResponse, error) {
	projects, err := s.repo.FindAll()
	if err != nil {
		return nil, fmt.Errorf("get projects: %w", err)
	}
	responses := make([]dto.ProjectResponse, len(projects))
	for i := range projects {
		responses[i] = mapProjectResponse(&projects[i])
	}
	return responses, nil
}

func (s *ProjectService) GetProjectByID(id uuid.UUID) (*dto.ProjectResponse, error) {
	project, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("get project: %w", err)
	}
	resp := mapProjectResponse(project)
	return &resp, nil
}

func (s *ProjectService) GetProjectDetailsByID(id uuid.UUID) (*dto.ProjectDetailsResponse, error) {
	project, err := s.repo.FindDetailsByID(id)
	if err != nil {
		return nil, fmt.Errorf("get project details: %w", err)
	}
	resp := mapProjectDetailsResponse(project)
	return &resp, nil
}

func (s *ProjectService) SearchProjectsByStatusAndCreatorCity(status, city string) ([]dto.ProjectResponse, error) {
	projects, err := s.repo.FindByStatusAndCreatorCity(status, city)
	if err != nil {
		return nil, fmt.Errorf("search projects: %w", err)
	}
	responses := make([]dto.ProjectResponse, len(projects))
	for i := range projects {
		responses[i] = mapProjectResponse(&projects[i])
	}
	return responses, nil
}

func (s *ProjectService) CountApplicationsByProject() ([]dto.ProjectApplicationsCountResponse, error) {
	results, err := s.repo.CountApplicationsByProject()
	if err != nil {
		return nil, fmt.Errorf("count applications: %w", err)
	}
	return results, nil
}

func (s *ProjectService) UpdateProject(id uuid.UUID, req dto.UpdateProjectRequest) (*dto.ProjectResponse, error) {
	project, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("project not found: %w", err)
	}
	project.Title = req.Title
	project.Description = req.Description
	project.Status = req.Status
	if err := s.repo.Update(project); err != nil {
		return nil, fmt.Errorf("update project: %w", err)
	}
	resp := mapProjectResponse(project)
	return &resp, nil
}

func (s *ProjectService) DeleteProject(id uuid.UUID) error {
	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("delete project: %w", err)
	}
	return nil
}

func mapProjectResponse(p *model.Project) dto.ProjectResponse {
	return dto.ProjectResponse{
		ID:          p.ID,
		Title:       p.Title,
		Description: p.Description,
		Status:      p.Status,
		CreatorID:   p.CreatorID,
		CreatedAt:   p.CreatedAt,
		UpdatedAt:   p.UpdatedAt,
	}
}

func mapProjectDetailsResponse(p *model.Project) dto.ProjectDetailsResponse {
	roles := make([]dto.ProjectRoleResponse, len(p.Roles))
	for i := range p.Roles {
		roles[i] = mapProjectRoleResponse(&p.Roles[i])
	}
	return dto.ProjectDetailsResponse{
		ID:          p.ID,
		Title:       p.Title,
		Description: p.Description,
		Status:      p.Status,
		Creator:     mapUserResponse(&p.Creator),
		Roles:       roles,
		CreatedAt:   p.CreatedAt,
		UpdatedAt:   p.UpdatedAt,
	}
}
