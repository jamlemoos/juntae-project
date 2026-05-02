package repository

import (
	"juntae-api/internal/domain/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProjectApplicationCount struct {
	ProjectID         uuid.UUID
	Title             string
	ApplicationsCount int64
}

type ProjectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

func (r *ProjectRepository) Create(project *model.Project) error {
	return r.db.Create(project).Error
}

func (r *ProjectRepository) FindAllForList(offset, limit int) ([]model.Project, error) {
	var projects []model.Project
	err := r.db.
		Preload("Creator").
		Preload("Creator.Skills").
		Preload("Roles").
		Offset(offset).Limit(limit).
		Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) FindByStatusAndCreatorCityForList(status, city string, offset, limit int) ([]model.Project, error) {
	var projects []model.Project
	err := r.db.
		Preload("Creator").
		Preload("Creator.Skills").
		Preload("Roles").
		Select("projects.*").
		Joins("JOIN users ON users.id = projects.creator_id").
		Where("projects.status = ? AND users.city = ?", status, city).
		Offset(offset).Limit(limit).
		Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) FindByCreatorIDForList(creatorID uuid.UUID, offset, limit int) ([]model.Project, error) {
	var projects []model.Project
	err := r.db.
		Preload("Creator").
		Preload("Creator.Skills").
		Preload("Roles").
		Where("projects.creator_id = ?", creatorID).
		Offset(offset).Limit(limit).
		Find(&projects).Error
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
		Preload("Roles.Applications", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, user_id, project_role_id")
		}).
		First(&project, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepository) CountApplicationsByProject() ([]ProjectApplicationCount, error) {
	var results []ProjectApplicationCount
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
