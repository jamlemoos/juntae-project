package repository

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"juntae-api/internal/domain/model"
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

func (r *ApplicationRepository) FindAll() ([]model.Application, error) {
	var applications []model.Application
	err := r.db.Find(&applications).Error
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

func (r *ApplicationRepository) Update(application *model.Application) error {
	return r.db.Save(application).Error
}

func (r *ApplicationRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Application{}, "id = ?", id).Error
}
