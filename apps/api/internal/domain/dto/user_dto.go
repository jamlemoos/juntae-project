package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateUserRequest struct {
	Name     string      `json:"name"      validate:"required,min=2"`
	Email    string      `json:"email"     validate:"required,email"`
	Bio      string      `json:"bio"`
	City     string      `json:"city"      validate:"required,min=2"`
	SkillIDs []uuid.UUID `json:"skill_ids"`
}

type UpdateUserRequest struct {
	Name     string      `json:"name"      validate:"required,min=2"`
	Email    string      `json:"email"     validate:"required,email"`
	Bio      string      `json:"bio"`
	City     string      `json:"city"      validate:"required,min=2"`
	SkillIDs []uuid.UUID `json:"skill_ids"`
}

type UserResponse struct {
	ID        uuid.UUID       `json:"id"`
	Name      string          `json:"name"`
	Email     string          `json:"email"`
	Bio       string          `json:"bio"`
	City      string          `json:"city"`
	Skills    []SkillResponse `json:"skills"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}
