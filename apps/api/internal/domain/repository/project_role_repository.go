package repository

import (
	"juntae-api/internal/domain/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProjectRoleRepository struct {
	db *gorm.DB
}

func NewProjectRoleRepository(db *gorm.DB) *ProjectRoleRepository {
	return &ProjectRoleRepository{db: db}
}

func (r *ProjectRoleRepository) Create(role *model.ProjectRole) error {
	return r.db.Create(role).Error
}

func (r *ProjectRoleRepository) FindAll() ([]model.ProjectRole, error) {
	var roles []model.ProjectRole
	err := r.db.Find(&roles).Error
	return roles, err
}

func (r *ProjectRoleRepository) FindAllWithApplications() ([]model.ProjectRole, error) {
	var roles []model.ProjectRole
	err := r.db.
		Preload("Applications", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, user_id, project_role_id")
		}).
		Find(&roles).Error
	return roles, err
}

func (r *ProjectRoleRepository) FindByProjectIDWithApplications(projectID uuid.UUID) ([]model.ProjectRole, error) {
	var roles []model.ProjectRole
	err := r.db.
		Preload("Applications", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, user_id, project_role_id")
		}).
		Where("project_id = ?", projectID).
		Find(&roles).Error
	return roles, err
}

func (r *ProjectRoleRepository) FindByID(id uuid.UUID) (*model.ProjectRole, error) {
	var role model.ProjectRole
	err := r.db.First(&role, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *ProjectRoleRepository) FindByIDWithApplications(id uuid.UUID) (*model.ProjectRole, error) {
	var role model.ProjectRole
	err := r.db.
		Preload("Applications", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, user_id, project_role_id")
		}).
		First(&role, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *ProjectRoleRepository) FindWithProject(id uuid.UUID) (*model.ProjectRole, error) {
	var role model.ProjectRole
	err := r.db.Preload("Project").First(&role, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *ProjectRoleRepository) Update(role *model.ProjectRole) error {
	return r.db.Save(role).Error
}

func (r *ProjectRoleRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.ProjectRole{}, "id = ?", id).Error
}
