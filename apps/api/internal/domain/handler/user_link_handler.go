package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
)

type UserLinkHandler struct {
	service *service.UserLinkService
}

func NewUserLinkHandler(svc *service.UserLinkService) *UserLinkHandler {
	return &UserLinkHandler{service: svc}
}

// GetMyLinks godoc
//
//	@Summary		List current user's external links
//	@Tags			links
//	@Produce		json
//	@Success		200	{array}		dto.UserLinkResponse
//	@Failure		401	{object}	map[string]string
//	@Router			/users/me/links [get]
//	@Security		BearerAuth
func (h *UserLinkHandler) GetMyLinks(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	links, err := h.service.GetLinks(callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, links)
}

// CreateLink godoc
//
//	@Summary		Add an external link to current user's profile
//	@Tags			links
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.CreateUserLinkRequest	true	"Link data"
//	@Success		201		{object}	dto.UserLinkResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		422		{object}	map[string]string	"URL must be http or https"
//	@Router			/users/me/links [post]
//	@Security		BearerAuth
func (h *UserLinkHandler) CreateLink(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.CreateUserLinkRequest
	if !bindAndValidate(c, &req) {
		return
	}
	link, err := h.service.CreateLink(callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, link)
}

// UpdateLink godoc
//
//	@Summary		Update an external link (owner only)
//	@Tags			links
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string						true	"Link UUID"
//	@Param			body	body		dto.UpdateUserLinkRequest	true	"Updated link data"
//	@Success		200		{object}	dto.UserLinkResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		404		{object}	map[string]string
//	@Router			/users/me/links/{id} [put]
//	@Security		BearerAuth
func (h *UserLinkHandler) UpdateLink(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.UpdateUserLinkRequest
	if !bindAndValidate(c, &req) {
		return
	}
	link, err := h.service.UpdateLink(id, callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, link)
}

// DeleteLink godoc
//
//	@Summary		Delete an external link (owner only)
//	@Tags			links
//	@Param			id	path	string	true	"Link UUID"
//	@Success		204
//	@Failure		401	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/users/me/links/{id} [delete]
//	@Security		BearerAuth
func (h *UserLinkHandler) DeleteLink(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	if err := h.service.DeleteLink(id, callerID); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
