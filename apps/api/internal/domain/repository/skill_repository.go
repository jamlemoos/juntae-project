package repository

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"juntae-api/internal/domain/model"
)

type SkillRepository struct {
	db *gorm.DB
}

func NewSkillRepository(db *gorm.DB) *SkillRepository {
	return &SkillRepository{db: db}
}

func (r *SkillRepository) Create(skill *model.Skill) error {
	return r.db.Create(skill).Error
}

func (r *SkillRepository) FindAll() ([]model.Skill, error) {
	var skills []model.Skill
	err := r.db.Find(&skills).Error
	return skills, err
}

func (r *SkillRepository) FindByID(id uuid.UUID) (*model.Skill, error) {
	var skill model.Skill
	err := r.db.First(&skill, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &skill, nil
}

func (r *SkillRepository) FindByIDs(ids []uuid.UUID) ([]model.Skill, error) {
	var skills []model.Skill
	err := r.db.Where("id IN ?", ids).Find(&skills).Error
	return skills, err
}

func (r *SkillRepository) Update(skill *model.Skill) error {
	return r.db.Save(skill).Error
}

func (r *SkillRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Skill{}, "id = ?", id).Error
}
