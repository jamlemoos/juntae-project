package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateProjectRoleRequest struct {
	Title       string    `json:"title"       validate:"required,min=2"`
	Description string    `json:"description"`
	Status      string    `json:"status"      validate:"required,oneof=OPEN CLOSED"`
	ProjectID   uuid.UUID `json:"project_id"  validate:"required"`
}

type UpdateProjectRoleRequest struct {
	Title       string `json:"title"       validate:"required,min=2"`
	Description string `json:"description"`
	Status      string `json:"status"      validate:"required,oneof=OPEN CLOSED"`
}

type ProjectRoleResponse struct {
	ID           uuid.UUID             `json:"id"`
	Title        string                `json:"title"`
	Description  string                `json:"description"`
	Status       string                `json:"status"`
	ProjectID    uuid.UUID             `json:"project_id"`
	Applications []ApplicationResponse `json:"applications"`
	CreatedAt    time.Time             `json:"created_at"`
	UpdatedAt    time.Time             `json:"updated_at"`
}
