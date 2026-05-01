package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Application struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey"`
	Message       string    `gorm:"not null"`
	Status        string    `gorm:"not null"`
	UserID        uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_role"`
	User          User
	ProjectRoleID uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_user_role;index:idx_app_role_id"`
	ProjectRole   ProjectRole
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func (a *Application) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}
