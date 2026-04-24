package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
)

type ProjectRoleHandler struct {
	projectRoleService *service.ProjectRoleService
}

func NewProjectRoleHandler(projectRoleService *service.ProjectRoleService) *ProjectRoleHandler {
	return &ProjectRoleHandler{projectRoleService: projectRoleService}
}

func (h *ProjectRoleHandler) CreateProjectRole(c *gin.Context) {
	var req dto.CreateProjectRoleRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.projectRoleService.CreateProjectRole(req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, resp)
}

func (h *ProjectRoleHandler) GetProjectRoles(c *gin.Context) {
	roles, err := h.projectRoleService.GetProjectRoles()
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
	role, err := h.projectRoleService.GetProjectRoleByID(id)
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
	var req dto.UpdateProjectRoleRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.projectRoleService.UpdateProjectRole(id, req)
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
	if err := h.projectRoleService.DeleteProjectRole(id); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
