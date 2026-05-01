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

type ProjectListItemResponse struct {
	ID              uuid.UUID          `json:"id"`
	Title           string             `json:"title"`
	Description     string             `json:"description"`
	Status          string             `json:"status"`
	Creator         PublicUserResponse `json:"creator"`
	OpenRolesCount  int                `json:"open_roles_count"`
	TotalRolesCount int                `json:"total_roles_count"`
	HasApplied      bool               `json:"has_applied"`
	IsOwner         bool               `json:"is_owner"`
	CreatedAt       time.Time          `json:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at"`
}

type ProjectDetailsResponse struct {
	ID          uuid.UUID             `json:"id"`
	Title       string                `json:"title"`
	Description string                `json:"description"`
	Status      string                `json:"status"`
	IsOwner     bool                  `json:"is_owner"`
	Creator     PublicUserResponse    `json:"creator"`
	Roles       []ProjectRoleResponse `json:"roles"`
	CreatedAt   time.Time             `json:"created_at"`
	UpdatedAt   time.Time             `json:"updated_at"`
}

type ProjectApplicationsCountResponse struct {
	ProjectID         uuid.UUID `json:"project_id"`
	Title             string    `json:"title"`
	ApplicationsCount int64     `json:"applications_count"`
}
