package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateProjectRoleInput struct {
	Title       string `json:"title"       validate:"required,min=2"`
	Description string `json:"description"`
	Status      string `json:"status"      validate:"required,oneof=OPEN CLOSED"`
}

type CreateProjectRequest struct {
	Title       string                   `json:"title"       validate:"required,min=3"`
	Description string                   `json:"description" validate:"required,min=10"`
	Status      string                   `json:"status"      validate:"required,oneof=OPEN IN_PROGRESS CLOSED"`
	CreatorID   uuid.UUID                `json:"creator_id"  validate:"required"`
	Roles       []CreateProjectRoleInput `json:"roles"       validate:"dive"`
}

type UpdateProjectRequest struct {
	Title       string `json:"title"       validate:"required,min=3"`
	Description string `json:"description" validate:"required,min=10"`
	Status      string `json:"status"      validate:"required,oneof=OPEN IN_PROGRESS CLOSED"`
}

type ProjectResponse struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatorID   uuid.UUID `json:"creator_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ProjectDetailsResponse struct {
	ID          uuid.UUID             `json:"id"`
	Title       string                `json:"title"`
	Description string                `json:"description"`
	Status      string                `json:"status"`
	Creator     UserResponse          `json:"creator"`
	Roles       []ProjectRoleResponse `json:"roles"`
	CreatedAt   time.Time             `json:"created_at"`
	UpdatedAt   time.Time             `json:"updated_at"`
}

type ProjectApplicationsCountResponse struct {
	ProjectID         uuid.UUID `json:"project_id"`
	Title             string    `json:"title"`
	ApplicationsCount int64     `json:"applications_count"`
}
