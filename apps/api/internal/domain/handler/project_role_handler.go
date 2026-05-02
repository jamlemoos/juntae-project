package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProjectRoleHandler struct {
	projectRoleService *service.ProjectRoleService
}

func NewProjectRoleHandler(projectRoleService *service.ProjectRoleService) *ProjectRoleHandler {
	return &ProjectRoleHandler{projectRoleService: projectRoleService}
}

func (h *ProjectRoleHandler) CreateProjectRole(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.CreateProjectRoleRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.projectRoleService.CreateProjectRole(callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, resp)
}

func (h *ProjectRoleHandler) GetProjectRoles(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	if raw := c.Query("project_id"); raw != "" {
		projectID, err := uuid.Parse(raw)
		if err != nil {
			respondWithError(c, http.StatusBadRequest, "invalid project_id")
			return
		}
		roles, err := h.projectRoleService.GetProjectRolesByProject(projectID, callerID)
		if err != nil {
			handleServiceError(c, err)
			return
		}
		respondWithJSON(c, http.StatusOK, roles)
		return
	}
	respondWithError(c, http.StatusBadRequest, "project_id is required")
}

func (h *ProjectRoleHandler) GetRolesByProject(c *gin.Context) {
	projectID, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	roles, err := h.projectRoleService.GetProjectRolesByProject(projectID, callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, roles)
}

func (h *ProjectRoleHandler) GetProjectRoleByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	role, err := h.projectRoleService.GetProjectRoleByID(id, callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, role)
}

func (h *ProjectRoleHandler) UpdateProjectRole(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.UpdateProjectRoleRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.projectRoleService.UpdateProjectRole(id, callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

func (h *ProjectRoleHandler) DeleteProjectRole(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	if err := h.projectRoleService.DeleteProjectRole(id, callerID); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
