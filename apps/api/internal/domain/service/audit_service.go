package service

import (
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"

	"github.com/google/uuid"
)

type AuditService struct {
	repo *repository.AuditRepository
}

func NewAuditService(repo *repository.AuditRepository) *AuditService {
	return &AuditService{repo: repo}
}

func (s *AuditService) LogAction(action string, entityName string, entityID uuid.UUID, description string) error {
	entry := &model.AuditLog{
		EntityName:  entityName,
		EntityID:    entityID,
		Action:      action,
		Description: description,
	}
	return s.repo.Create(entry)
}

func (s *AuditService) LogCreate(entityName string, entityID uuid.UUID, description string) error {
	return s.LogAction("CREATE", entityName, entityID, description)
}
