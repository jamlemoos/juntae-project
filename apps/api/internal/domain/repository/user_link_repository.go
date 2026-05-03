package repository

import (
	"juntae-api/internal/domain/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserLinkRepository struct {
	db *gorm.DB
}

func NewUserLinkRepository(db *gorm.DB) *UserLinkRepository {
	return &UserLinkRepository{db: db}
}

func (r *UserLinkRepository) FindByUserID(userID uuid.UUID) ([]model.UserLink, error) {
	var links []model.UserLink
	err := r.db.Where("user_id = ?", userID).Order("created_at asc").Find(&links).Error
	return links, err
}

func (r *UserLinkRepository) Create(link *model.UserLink) error {
	return r.db.Create(link).Error
}

func (r *UserLinkRepository) FindByIDAndUserID(id, userID uuid.UUID) (*model.UserLink, error) {
	var link model.UserLink
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&link).Error
	if err != nil {
		return nil, err
	}
	return &link, nil
}

func (r *UserLinkRepository) Update(link *model.UserLink) error {
	return r.db.Save(link).Error
}

// Delete removes the link only if it belongs to userID (no-op if not found — idempotent).
func (r *UserLinkRepository) Delete(id, userID uuid.UUID) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&model.UserLink{}).Error
}
