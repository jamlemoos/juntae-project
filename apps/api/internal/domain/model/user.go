package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name         string    `gorm:"not null"`
	Email        string    `gorm:"not null;uniqueIndex"`
	Password     string    `gorm:"not null"`
	Role         string    `gorm:"not null;default:'member'"`
	Bio          string
	City         string        `gorm:"not null"`
	Skills       []Skill       `gorm:"many2many:user_skills"`
	Projects     []Project     `gorm:"foreignKey:CreatorID"`
	Applications []Application `gorm:"foreignKey:UserID"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
