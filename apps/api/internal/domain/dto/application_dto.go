package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateApplicationRequest struct {
	Message       string    `json:"message"         validate:"required,min=10"`
	ProjectRoleID uuid.UUID `json:"project_role_id" validate:"required"`
}

type UpdateApplicationRequest struct {
	Message string `json:"message" validate:"required,min=10"`
}

type UpdateApplicationStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=ACCEPTED REJECTED"`
}

type ApplicationResponse struct {
	ID            uuid.UUID `json:"id"`
	Message       string    `json:"message"`
	Status        string    `json:"status"`
	UserID        uuid.UUID `json:"user_id"`
	ProjectRoleID uuid.UUID `json:"project_role_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type ApplicationDetailResponse struct {
	ID            uuid.UUID          `json:"id"`
	Message       string             `json:"message"`
	Status        string             `json:"status"`
	User          PublicUserResponse `json:"user"`
	ProjectRoleID uuid.UUID          `json:"project_role_id"`
	RoleTitle     string             `json:"role_title"`
	CreatedAt     time.Time          `json:"created_at"`
	UpdatedAt     time.Time          `json:"updated_at"`
}
