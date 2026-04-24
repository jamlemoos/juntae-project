package dto

import (
	"time"

	"github.com/google/uuid"
)

type AuditLogResponse struct {
	ID          uuid.UUID `json:"id"`
	EntityName  string    `json:"entity_name"`
	EntityID    uuid.UUID `json:"entity_id"`
	Action      string    `json:"action"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}
