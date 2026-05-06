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

// CreateApplication godoc
//
//	@Summary		Apply to a project role
//	@Tags			applications
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.CreateApplicationRequest	true	"Application data"
//	@Success		201		{object}	dto.ApplicationResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string	"Project owner cannot apply to own project"
//	@Failure		409		{object}	map[string]string	"Already applied or project/role is closed"
//	@Router			/applications [post]
//	@Security		BearerAuth
func (h *ApplicationHandler) CreateApplication(c *gin.Context) {
	userID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.CreateApplicationRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.applicationService.CreateApplication(userID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, resp)
}

// GetApplications godoc
//
//	@Summary		List current user's applications
//	@Tags			applications
//	@Produce		json
//	@Success		200	{array}		dto.ApplicationResponse
//	@Failure		401	{object}	map[string]string
//	@Router			/applications [get]
//	@Security		BearerAuth
func (h *ApplicationHandler) GetApplications(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	applications, err := h.applicationService.GetMyApplications(callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, applications)
}

// GetApplicationByID godoc
//
//	@Summary		Get an application by ID (applicant or project owner)
//	@Tags			applications
//	@Produce		json
//	@Param			id	path		string	true	"Application UUID"
//	@Success		200	{object}	dto.ApplicationResponse
//	@Failure		401	{object}	map[string]string
//	@Failure		403	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/applications/{id} [get]
//	@Security		BearerAuth
func (h *ApplicationHandler) GetApplicationByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	application, err := h.applicationService.GetApplicationByID(id, callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, application)
}

// UpdateApplication godoc
//
//	@Summary		Update application message (applicant only)
//	@Tags			applications
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string							true	"Application UUID"
//	@Param			body	body		dto.UpdateApplicationRequest	true	"Updated message"
//	@Success		200		{object}	dto.ApplicationResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string
//	@Router			/applications/{id} [put]
//	@Security		BearerAuth
func (h *ApplicationHandler) UpdateApplication(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.UpdateApplicationRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.applicationService.UpdateApplication(id, callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

// UpdateApplicationStatus godoc
//
//	@Summary		Accept or reject an application (project owner only)
//	@Tags			applications
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string								true	"Application UUID"
//	@Param			body	body		dto.UpdateApplicationStatusRequest	true	"New status (ACCEPTED or REJECTED)"
//	@Success		200		{object}	dto.ApplicationResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string
//	@Router			/applications/{id}/status [patch]
//	@Security		BearerAuth
func (h *ApplicationHandler) UpdateApplicationStatus(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.UpdateApplicationStatusRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.applicationService.UpdateApplicationStatus(id, callerID, req.Status)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

// DeleteApplication godoc
//
//	@Summary		Withdraw an application (applicant only)
//	@Tags			applications
//	@Param			id	path	string	true	"Application UUID"
//	@Success		204
//	@Failure		401	{object}	map[string]string
//	@Failure		403	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/applications/{id} [delete]
//	@Security		BearerAuth
func (h *ApplicationHandler) DeleteApplication(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	if err := h.applicationService.DeleteApplication(id, callerID); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
