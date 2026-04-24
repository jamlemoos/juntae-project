package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateSkillRequest struct {
	Name string `json:"name" validate:"required,min=2"`
}

type UpdateSkillRequest struct {
	Name string `json:"name" validate:"required,min=2"`
}

type SkillResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
