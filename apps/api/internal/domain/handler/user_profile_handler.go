package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
)

type UserProfileHandler struct {
	service *service.UserProfileService
}

func NewUserProfileHandler(svc *service.UserProfileService) *UserProfileHandler {
	return &UserProfileHandler{service: svc}
}

// GetMyProfile godoc
//
//	@Summary		Get current user's extended profile
//	@Tags			profile
//	@Produce		json
//	@Success		200	{object}	dto.UserProfileResponse
//	@Failure		401	{object}	map[string]string
//	@Router			/users/me/profile [get]
//	@Security		BearerAuth
func (h *UserProfileHandler) GetMyProfile(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	profile, err := h.service.GetProfile(callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, profile)
}

// UpsertProfile godoc
//
//	@Summary		Create or update current user's extended profile
//	@Tags			profile
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.UpsertUserProfileRequest	true	"Profile data"
//	@Success		200		{object}	dto.UserProfileResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Router			/users/me/profile [put]
//	@Security		BearerAuth
func (h *UserProfileHandler) UpsertProfile(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.UpsertUserProfileRequest
	if !bindAndValidate(c, &req) {
		return
	}
	profile, err := h.service.UpsertProfile(callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, profile)
}
