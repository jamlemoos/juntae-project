package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserLink struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index"`
	Kind      string    `gorm:"not null"`
	Label     string
	URL       string `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (ul *UserLink) BeforeCreate(tx *gorm.DB) error {
	if ul.ID == uuid.Nil {
		ul.ID = uuid.New()
	}
	return nil
}
