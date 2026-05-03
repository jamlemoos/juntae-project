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
