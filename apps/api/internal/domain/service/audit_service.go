package service

import (
	"github.com/google/uuid"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"
)

type AuditService struct {
	repo *repository.AuditRepository
}

func NewAuditService(repo *repository.AuditRepository) *AuditService {
	return &AuditService{repo: repo}
}

func (s *AuditService) LogCreate(entityName string, entityID uuid.UUID, description string) error {
	entry := &model.AuditLog{
		EntityName:  entityName,
		EntityID:    entityID,
		Action:      "CREATE",
		Description: description,
	}
	return s.repo.Create(entry)
}
