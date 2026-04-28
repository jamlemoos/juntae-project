package handler

import (
	"errors"
	"net/http"

	"juntae-api/internal/domain/service"
	"juntae-api/internal/validation"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func respondWithError(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, gin.H{"error": message})
}

func respondWithJSON(c *gin.Context, statusCode int, payload any) {
	c.JSON(statusCode, payload)
}

func bindAndValidate(c *gin.Context, payload any) bool {
	if err := c.ShouldBindJSON(payload); err != nil {
		respondWithError(c, http.StatusBadRequest, "invalid request body")
		return false
	}
	if err := validation.ValidateStruct(payload); err != nil {
		respondWithError(c, http.StatusBadRequest, err.Error())
		return false
	}
	return true
}

func parseUUIDParam(c *gin.Context, paramName string) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param(paramName))
	if err != nil {
		respondWithError(c, http.StatusBadRequest, "invalid id parameter")
		return uuid.Nil, false
	}
	return id, true
}

func handleServiceError(c *gin.Context, err error) {
	if errors.Is(err, service.ErrInvalidCredentials) {
		respondWithError(c, http.StatusUnauthorized, "invalid credentials")
		return
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		respondWithError(c, http.StatusNotFound, "record not found")
		return
	}
	respondWithError(c, http.StatusInternalServerError, err.Error())
}
