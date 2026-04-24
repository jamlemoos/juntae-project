package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProjectRole struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey"`
	Title        string    `gorm:"not null"`
	Description  string
	Status       string    `gorm:"not null"`
	ProjectID    uuid.UUID `gorm:"type:uuid;not null"`
	Project      Project
	Applications []Application `gorm:"foreignKey:ProjectRoleID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (pr *ProjectRole) BeforeCreate(tx *gorm.DB) error {
	if pr.ID == uuid.Nil {
		pr.ID = uuid.New()
	}
	return nil
}
