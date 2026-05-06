package repository

import (
	"juntae-api/internal/domain/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindAll() ([]model.User, error) {
	var users []model.User
	err := r.db.Preload("Skills").Find(&users).Error
	return users, err
}

func (r *UserRepository) FindByID(id uuid.UUID) (*model.User, error) {
	var user model.User
	err := r.db.Preload("Skills").First(&user, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *model.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.User{}, "id = ?", id).Error
}

func (r *UserRepository) UpdateWithSkills(user *model.User, skills []model.Skill) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(user).Association("Skills").Replace(skills); err != nil {
			return err
		}
		return tx.Save(user).Error
	})
}

func (r *UserRepository) FindSkillsByIDs(ids []uuid.UUID) ([]model.Skill, error) {
	var skills []model.Skill
	err := r.db.Where("id IN ?", ids).Find(&skills).Error
	return skills, err
}

func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Skills").Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
