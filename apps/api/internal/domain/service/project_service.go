package service

import (
	"fmt"
	"log"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"

	"github.com/google/uuid"
)

type ProjectService struct {
	repo            *repository.ProjectRepository
	applicationRepo *repository.ApplicationRepository
	audit           *AuditService
}

func NewProjectService(
	repo *repository.ProjectRepository,
	applicationRepo *repository.ApplicationRepository,
	audit *AuditService,
) *ProjectService {
	return &ProjectService{repo: repo, applicationRepo: applicationRepo, audit: audit}
}

func (s *ProjectService) CreateProject(creatorID uuid.UUID, req dto.CreateProjectRequest) (*dto.ProjectResponse, error) {
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
		CreatorID:   creatorID,
		Roles:       roles,
	}
	if err := s.repo.Create(project); err != nil {
		return nil, fmt.Errorf("create project: %w", err)
	}
	if err := s.audit.LogCreate("Project", project.ID, fmt.Sprintf("Project created: %s", project.Title)); err != nil {
		log.Printf("WARN: audit log failed for project create %s: %v", project.ID, err)
	}
	resp := mapProjectResponse(project)
	return &resp, nil
}

func (s *ProjectService) GetProjectsForList(callerID uuid.UUID, status, city string) ([]dto.ProjectListItemResponse, error) {
	var (
		projects []model.Project
		err      error
	)
	if status != "" && city != "" {
		projects, err = s.repo.FindByStatusAndCreatorCityForList(status, city)
	} else {
		projects, err = s.repo.FindAllForList()
	}
	if err != nil {
		return nil, fmt.Errorf("get projects: %w", err)
	}
	appliedSet, err := s.applicationRepo.FindProjectIDsWhereUserApplied(callerID)
	if err != nil {
		return nil, fmt.Errorf("check applied projects: %w", err)
	}
	responses := make([]dto.ProjectListItemResponse, len(projects))
	for i := range projects {
		responses[i] = mapProjectListItemResponse(&projects[i], callerID, appliedSet)
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

func (s *ProjectService) GetProjectDetailsByID(id uuid.UUID, callerID uuid.UUID) (*dto.ProjectDetailsResponse, error) {
	project, err := s.repo.FindDetailsByID(id)
	if err != nil {
		return nil, fmt.Errorf("get project details: %w", err)
	}
	resp := mapProjectDetailsResponse(project, callerID)
	return &resp, nil
}

func (s *ProjectService) CountApplicationsByProject() ([]dto.ProjectApplicationsCountResponse, error) {
	counts, err := s.repo.CountApplicationsByProject()
	if err != nil {
		return nil, fmt.Errorf("count applications: %w", err)
	}
	responses := make([]dto.ProjectApplicationsCountResponse, len(counts))
	for i, c := range counts {
		responses[i] = dto.ProjectApplicationsCountResponse{
			ProjectID:         c.ProjectID,
			Title:             c.Title,
			ApplicationsCount: c.ApplicationsCount,
		}
	}
	return responses, nil
}

func (s *ProjectService) UpdateProject(id uuid.UUID, callerID uuid.UUID, req dto.UpdateProjectRequest) (*dto.ProjectResponse, error) {
	project, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("project not found: %w", err)
	}
	if project.CreatorID != callerID {
		return nil, ErrForbidden
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

func (s *ProjectService) DeleteProject(id uuid.UUID, callerID uuid.UUID) error {
	project, err := s.repo.FindByID(id)
	if err != nil {
		return fmt.Errorf("project not found: %w", err)
	}
	if project.CreatorID != callerID {
		return ErrForbidden
	}
	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("delete project: %w", err)
	}
	return nil
}

func (s *ProjectService) GetProjectApplications(projectID uuid.UUID, callerID uuid.UUID) ([]dto.ApplicationDetailResponse, error) {
	project, err := s.repo.FindByID(projectID)
	if err != nil {
		return nil, fmt.Errorf("project not found: %w", err)
	}
	if project.CreatorID != callerID {
		return nil, ErrForbidden
	}
	applications, err := s.applicationRepo.FindByProjectID(projectID)
	if err != nil {
		return nil, fmt.Errorf("get project applications: %w", err)
	}
	responses := make([]dto.ApplicationDetailResponse, len(applications))
	for i := range applications {
		responses[i] = mapApplicationDetailResponse(&applications[i])
	}
	return responses, nil
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

func mapProjectListItemResponse(p *model.Project, callerID uuid.UUID, appliedSet map[uuid.UUID]struct{}) dto.ProjectListItemResponse {
	var openCount int
	for _, r := range p.Roles {
		if r.Status == "OPEN" {
			openCount++
		}
	}
	_, hasApplied := appliedSet[p.ID]
	return dto.ProjectListItemResponse{
		ID:              p.ID,
		Title:           p.Title,
		Description:     p.Description,
		Status:          p.Status,
		Creator:         mapPublicUserResponse(&p.Creator),
		OpenRolesCount:  openCount,
		TotalRolesCount: len(p.Roles),
		HasApplied:      hasApplied,
		IsOwner:         p.CreatorID == callerID,
		CreatedAt:       p.CreatedAt,
		UpdatedAt:       p.UpdatedAt,
	}
}

func mapProjectDetailsResponse(p *model.Project, callerID uuid.UUID) dto.ProjectDetailsResponse {
	roles := make([]dto.ProjectRoleResponse, len(p.Roles))
	for i := range p.Roles {
		roles[i] = mapProjectRoleResponse(&p.Roles[i], callerID)
	}
	return dto.ProjectDetailsResponse{
		ID:          p.ID,
		Title:       p.Title,
		Description: p.Description,
		Status:      p.Status,
		IsOwner:     p.CreatorID == callerID,
		Creator:     mapPublicUserResponse(&p.Creator),
		Roles:       roles,
		CreatedAt:   p.CreatedAt,
		UpdatedAt:   p.UpdatedAt,
	}
}
