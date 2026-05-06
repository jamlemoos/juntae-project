package dto

import (
	"time"

	"github.com/google/uuid"
)

type UpsertUserProfileRequest struct {
	Headline     string `json:"headline"`
	Availability string `json:"availability" validate:"omitempty,oneof=available busy open_to_opportunities"`
}

type UserProfileResponse struct {
	ID           uuid.UUID `json:"id,omitempty"`
	UserID       uuid.UUID `json:"user_id"`
	Headline     string    `json:"headline"`
	Availability string    `json:"availability"`
	CreatedAt    time.Time `json:"created_at,omitempty"`
	UpdatedAt    time.Time `json:"updated_at,omitempty"`
}
