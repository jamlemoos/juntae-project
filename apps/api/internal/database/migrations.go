package database

import (
	"gorm.io/gorm"
	"juntae-api/internal/domain/model"
)

func RunMainMigrations(db *gorm.DB) error {
	return db.AutoMigrate(
		&model.User{},
		&model.Skill{},
		&model.Project{},
		&model.ProjectRole{},
		&model.Application{},
		&model.UserLink{},
	)
}

func RunAuditMigrations(db *gorm.DB) error {
	return db.AutoMigrate(
		&model.AuditLog{},
	)
}
