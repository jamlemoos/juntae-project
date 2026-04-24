package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Skill struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name      string    `gorm:"not null;uniqueIndex"`
	Users     []User    `gorm:"many2many:user_skills"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (s *Skill) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}
