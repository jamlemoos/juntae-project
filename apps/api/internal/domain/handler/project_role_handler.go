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

// CreateProjectRole godoc
//
//	@Summary		Create a role for a project (project owner only)
//	@Tags			project-roles
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.CreateProjectRoleRequest	true	"Role data"
//	@Success		201		{object}	dto.ProjectRoleResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string
//	@Router			/project-roles [post]
//	@Security		BearerAuth
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

// GetRolesByProject godoc
//
//	@Summary		List roles for a project
//	@Tags			project-roles
//	@Produce		json
//	@Param			id	path		string	true	"Project UUID"
//	@Success		200	{array}		dto.ProjectRoleResponse
//	@Failure		401	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/projects/{id}/roles [get]
//	@Security		BearerAuth
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

// GetProjectRoleByID godoc
//
//	@Summary		Get a project role by ID
//	@Tags			project-roles
//	@Produce		json
//	@Param			id	path		string	true	"ProjectRole UUID"
//	@Success		200	{object}	dto.ProjectRoleResponse
//	@Failure		400	{object}	map[string]string
//	@Failure		401	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/project-roles/{id} [get]
//	@Security		BearerAuth
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

// UpdateProjectRole godoc
//
//	@Summary		Update a project role (project owner only)
//	@Tags			project-roles
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string						true	"ProjectRole UUID"
//	@Param			body	body		dto.UpdateProjectRoleRequest	true	"Role data"
//	@Success		200		{object}	dto.ProjectRoleResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string
//	@Router			/project-roles/{id} [put]
//	@Security		BearerAuth
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

// DeleteProjectRole godoc
//
//	@Summary		Delete a project role (project owner only)
//	@Tags			project-roles
//	@Param			id	path	string	true	"ProjectRole UUID"
//	@Success		204
//	@Failure		401	{object}	map[string]string
//	@Failure		403	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/project-roles/{id} [delete]
//	@Security		BearerAuth
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
