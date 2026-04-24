package repository

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"juntae-api/internal/domain/model"
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

func (r *ProjectRoleRepository) FindByID(id uuid.UUID) (*model.ProjectRole, error) {
	var role model.ProjectRole
	err := r.db.First(&role, "id = ?", id).Error
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
