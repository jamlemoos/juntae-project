package handler

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"juntae-api/internal/domain/service"
	"juntae-api/internal/middleware"
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

func getAuthUserID(c *gin.Context) (uuid.UUID, bool) {
	val, exists := c.Get(middleware.ContextKeyUserID)
	if !exists {
		respondWithError(c, http.StatusUnauthorized, "unauthorized")
		return uuid.Nil, false
	}
	id, ok := val.(uuid.UUID)
	if !ok {
		respondWithError(c, http.StatusInternalServerError, "internal server error")
		return uuid.Nil, false
	}
	return id, true
}

func handleServiceError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrInvalidCredentials):
		respondWithError(c, http.StatusUnauthorized, "invalid credentials")
	case errors.Is(err, gorm.ErrRecordNotFound):
		respondWithError(c, http.StatusNotFound, "record not found")
	case errors.Is(err, service.ErrForbidden):
		respondWithError(c, http.StatusForbidden, "forbidden")
	case errors.Is(err, service.ErrConflict):
		respondWithError(c, http.StatusConflict, "conflict")
	case errors.Is(err, service.ErrProjectClosed):
		respondWithError(c, http.StatusConflict, "project is not open for applications")
	case errors.Is(err, service.ErrRoleClosed):
		respondWithError(c, http.StatusConflict, "role is not open for applications")
	default:
		log.Printf("ERROR: internal server error: %v", err)
		respondWithError(c, http.StatusInternalServerError, "internal server error")
	}
}

func parsePagination(c *gin.Context) (offset, limit int) {
	page := 1
	limit = 20
	if p, err := strconv.Atoi(c.Query("page")); err == nil && p > 0 {
		page = p
	}
	if l, err := strconv.Atoi(c.Query("limit")); err == nil && l > 0 {
		if l > 50 {
			l = 50
		}
		limit = l
	}
	offset = (page - 1) * limit
	return
}
