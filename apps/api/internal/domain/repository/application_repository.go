package repository

import (
	"juntae-api/internal/domain/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ApplicationRepository struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) *ApplicationRepository {
	return &ApplicationRepository{db: db}
}

func (r *ApplicationRepository) Create(application *model.Application) error {
	return r.db.Create(application).Error
}

func (r *ApplicationRepository) FindByUserID(userID uuid.UUID) ([]model.Application, error) {
	var applications []model.Application
	err := r.db.Where("user_id = ?", userID).Find(&applications).Error
	return applications, err
}

func (r *ApplicationRepository) FindByID(id uuid.UUID) (*model.Application, error) {
	var application model.Application
	err := r.db.First(&application, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &application, nil
}

func (r *ApplicationRepository) FindWithProjectChain(id uuid.UUID) (*model.Application, error) {
	var application model.Application
	err := r.db.
		Preload("ProjectRole.Project").
		First(&application, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &application, nil
}

func (r *ApplicationRepository) FindByProjectID(projectID uuid.UUID) ([]model.Application, error) {
	var applications []model.Application
	err := r.db.
		Select("applications.*").
		Joins("JOIN project_roles ON project_roles.id = applications.project_role_id").
		Where("project_roles.project_id = ?", projectID).
		Preload("User.Skills").
		Preload("ProjectRole").
		Find(&applications).Error
	return applications, err
}

func (r *ApplicationRepository) FindProjectIDsWhereUserApplied(userID uuid.UUID) (map[uuid.UUID]struct{}, error) {
	var projectIDs []uuid.UUID
	err := r.db.Raw(`
		SELECT DISTINCT pr.project_id
		FROM applications a
		JOIN project_roles pr ON pr.id = a.project_role_id
		WHERE a.user_id = ?
	`, userID).Scan(&projectIDs).Error
	if err != nil {
		return nil, err
	}
	set := make(map[uuid.UUID]struct{}, len(projectIDs))
	for _, id := range projectIDs {
		set[id] = struct{}{}
	}
	return set, nil
}

func (r *ApplicationRepository) ExistsByUserAndRole(userID, roleID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&model.Application{}).
		Where("user_id = ? AND project_role_id = ?", userID, roleID).
		Count(&count).Error
	return count > 0, err
}

func (r *ApplicationRepository) Update(application *model.Application) error {
	return r.db.Save(application).Error
}

func (r *ApplicationRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Application{}, "id = ?", id).Error
}
