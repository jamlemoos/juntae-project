package dto

import (
	"time"

	"github.com/google/uuid"
)

// Allowed kinds: LINKEDIN GITHUB BEHANCE DRIBBBLE FIGMA PORTFOLIO OTHER
type CreateUserLinkRequest struct {
	Kind  string `json:"kind"  validate:"required,oneof=LINKEDIN GITHUB BEHANCE DRIBBBLE FIGMA PORTFOLIO OTHER"`
	Label string `json:"label"`
	URL   string `json:"url"   validate:"required,url"`
}

type UpdateUserLinkRequest struct {
	Kind  string `json:"kind"  validate:"required,oneof=LINKEDIN GITHUB BEHANCE DRIBBBLE FIGMA PORTFOLIO OTHER"`
	Label string `json:"label"`
	URL   string `json:"url"   validate:"required,url"`
}

type UserLinkResponse struct {
	ID        uuid.UUID `json:"id"`
	Kind      string    `json:"kind"`
	Label     string    `json:"label"`
	URL       string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
