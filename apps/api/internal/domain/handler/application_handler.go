package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
)

type ApplicationHandler struct {
	applicationService *service.ApplicationService
}

func NewApplicationHandler(applicationService *service.ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{applicationService: applicationService}
}

func (h *ApplicationHandler) CreateApplication(c *gin.Context) {
	var req dto.CreateApplicationRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.applicationService.CreateApplication(req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, resp)
}

func (h *ApplicationHandler) GetApplications(c *gin.Context) {
	applications, err := h.applicationService.GetApplications()
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, applications)
}

func (h *ApplicationHandler) GetApplicationByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	application, err := h.applicationService.GetApplicationByID(id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, application)
}

func (h *ApplicationHandler) UpdateApplication(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var req dto.UpdateApplicationRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.applicationService.UpdateApplication(id, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

func (h *ApplicationHandler) DeleteApplication(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.applicationService.DeleteApplication(id); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
