package repository

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
)

type ProjectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

func (r *ProjectRepository) Create(project *model.Project) error {
	return r.db.Create(project).Error
}

func (r *ProjectRepository) FindAll() ([]model.Project, error) {
	var projects []model.Project
	err := r.db.Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) FindByID(id uuid.UUID) (*model.Project, error) {
	var project model.Project
	err := r.db.First(&project, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepository) FindDetailsByID(id uuid.UUID) (*model.Project, error) {
	var project model.Project
	err := r.db.
		Preload("Creator").
		Preload("Creator.Skills").
		Preload("Roles").
		Preload("Roles.Applications").
		Preload("Roles.Applications.User").
		First(&project, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepository) FindByStatusAndCreatorCity(status string, city string) ([]model.Project, error) {
	var projects []model.Project
	err := r.db.
		Joins("JOIN users ON users.id = projects.creator_id").
		Where("projects.status = ? AND users.city = ?", status, city).
		Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) CountApplicationsByProject() ([]dto.ProjectApplicationsCountResponse, error) {
	var results []dto.ProjectApplicationsCountResponse
	err := r.db.Raw(`
		SELECT
			p.id          AS project_id,
			p.title       AS title,
			COUNT(a.id)   AS applications_count
		FROM projects p
		LEFT JOIN project_roles pr ON pr.project_id = p.id
		LEFT JOIN applications a   ON a.project_role_id = pr.id
		GROUP BY p.id, p.title
		ORDER BY p.title
	`).Scan(&results).Error
	return results, err
}

func (r *ProjectRepository) Update(project *model.Project) error {
	return r.db.Save(project).Error
}

func (r *ProjectRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Project{}, "id = ?", id).Error
}
