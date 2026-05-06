package repository

import (
	"errors"

	"juntae-api/internal/domain/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserProfileRepository struct {
	db *gorm.DB
}

func NewUserProfileRepository(db *gorm.DB) *UserProfileRepository {
	return &UserProfileRepository{db: db}
}

func (r *UserProfileRepository) FindByUserID(userID uuid.UUID) (*model.UserProfile, error) {
	var profile model.UserProfile
	err := r.db.Where("user_id = ?", userID).First(&profile).Error
	return &profile, err
}

func (r *UserProfileRepository) Upsert(profile *model.UserProfile) error {
	var existing model.UserProfile
	err := r.db.Where("user_id = ?", profile.UserID).First(&existing).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return r.db.Create(profile).Error
	}
	if err != nil {
		return err
	}
	profile.ID = existing.ID
	profile.CreatedAt = existing.CreatedAt
	return r.db.Save(profile).Error
}
