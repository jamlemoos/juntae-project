package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateApplicationRequest struct {
	Message       string    `json:"message"         validate:"required,min=10"`
	Status        string    `json:"status"          validate:"required,oneof=PENDING ACCEPTED REJECTED"`
	UserID        uuid.UUID `json:"user_id"         validate:"required"`
	ProjectRoleID uuid.UUID `json:"project_role_id" validate:"required"`
}

type UpdateApplicationRequest struct {
	Message string `json:"message" validate:"required,min=10"`
	Status  string `json:"status"  validate:"required,oneof=PENDING ACCEPTED REJECTED"`
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
