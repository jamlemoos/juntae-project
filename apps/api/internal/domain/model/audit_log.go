package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuditLog struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	EntityName  string    `gorm:"not null"`
	EntityID    uuid.UUID `gorm:"type:uuid;not null"`
	Action      string    `gorm:"not null"`
	Description string
	CreatedAt   time.Time
}

func (al *AuditLog) BeforeCreate(tx *gorm.DB) error {
	if al.ID == uuid.Nil {
		al.ID = uuid.New()
	}
	return nil
}
