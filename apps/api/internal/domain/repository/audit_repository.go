package repository

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"juntae-api/internal/domain/model"
)

type AuditRepository struct {
	db *gorm.DB
}

func NewAuditRepository(db *gorm.DB) *AuditRepository {
	return &AuditRepository{db: db}
}

func (r *AuditRepository) Create(log *model.AuditLog) error {
	return r.db.Create(log).Error
}

func (r *AuditRepository) FindAll() ([]model.AuditLog, error) {
	var logs []model.AuditLog
	err := r.db.Find(&logs).Error
	return logs, err
}

func (r *AuditRepository) FindByID(id uuid.UUID) (*model.AuditLog, error) {
	var log model.AuditLog
	err := r.db.First(&log, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &log, nil
}
