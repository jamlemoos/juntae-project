package repository

import (
	"errors"

	"juntae-api/internal/domain/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
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

func (r *SkillRepository) FindByName(name string) (*model.Skill, error) {
	var skill model.Skill
	err := r.db.Where("LOWER(name) = LOWER(?)", name).First(&skill).Error
	if err != nil {
		return nil, err
	}
	return &skill, nil
}

// FindOrCreateByName returns an existing skill with the given name (case-insensitive)
// or creates a new one. Safe against race conditions: on unique violation it retries the lookup.
func (r *SkillRepository) FindOrCreateByName(name string) (*model.Skill, error) {
	var found model.Skill
	if err := r.db.Where("LOWER(name) = LOWER(?)", name).First(&found).Error; err == nil {
		return &found, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	newSkill := &model.Skill{Name: name}
	if err := r.db.Create(newSkill).Error; err != nil {
		// race: another request created it first – retry the lookup
		var existing model.Skill
		if ferr := r.db.Where("LOWER(name) = LOWER(?)", name).First(&existing).Error; ferr == nil {
			return &existing, nil
		}
		return nil, err
	}
	return newSkill, nil
}

func (r *SkillRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Skill{}, "id = ?", id).Error
}
