package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	projectService *service.ProjectService
}

func NewProjectHandler(projectService *service.ProjectService) *ProjectHandler {
	return &ProjectHandler{projectService: projectService}
}

// CreateProject godoc
//
//	@Summary		Create a new project
//	@Tags			projects
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.CreateProjectRequest	true	"Project data"
//	@Success		201		{object}	dto.ProjectResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Router			/projects [post]
//	@Security		BearerAuth
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.CreateProjectRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.projectService.CreateProject(callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, resp)
}

// GetProjects godoc
//
//	@Summary		List projects (optionally filtered by status and city)
//	@Tags			projects
//	@Produce		json
//	@Param			status	query		string	false	"Filter by status (OPEN, IN_PROGRESS, CLOSED)"
//	@Param			city	query		string	false	"Filter by creator's city"
//	@Param			page	query		int		false	"Page number (default 1)"
//	@Param			limit	query		int		false	"Items per page (default 20, max 50)"
//	@Success		200		{array}		dto.ProjectListItemResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Router			/projects [get]
//	@Security		BearerAuth
func (h *ProjectHandler) GetProjects(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	status := c.Query("status")
	city := c.Query("city")
	if (status == "") != (city == "") {
		respondWithError(c, http.StatusBadRequest, "both 'status' and 'city' query params are required when filtering")
		return
	}
	offset, limit, err := parsePagination(c)
	if err != nil {
		respondWithError(c, http.StatusBadRequest, err.Error())
		return
	}
	projects, err := h.projectService.GetProjectsForList(callerID, status, city, offset, limit)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, projects)
}

// GetMyProjects godoc
//
//	@Summary		List projects owned by the current user
//	@Tags			projects
//	@Produce		json
//	@Param			page	query		int	false	"Page number"
//	@Param			limit	query		int	false	"Items per page"
//	@Success		200		{array}		dto.ProjectListItemResponse
//	@Failure		401		{object}	map[string]string
//	@Router			/projects/me [get]
//	@Security		BearerAuth
func (h *ProjectHandler) GetMyProjects(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	offset, limit, err := parsePagination(c)
	if err != nil {
		respondWithError(c, http.StatusBadRequest, err.Error())
		return
	}
	projects, err := h.projectService.GetProjectsForOwner(callerID, offset, limit)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, projects)
}

// CountApplicationsByProject godoc
//
//	@Summary		Count applications grouped by project (custom query)
//	@Tags			projects
//	@Produce		json
//	@Success		200	{array}		dto.ProjectApplicationsCountResponse
//	@Failure		401	{object}	map[string]string
//	@Router			/projects/stats/applications-count [get]
//	@Security		BearerAuth
func (h *ProjectHandler) CountApplicationsByProject(c *gin.Context) {
	results, err := h.projectService.CountApplicationsByProject()
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, results)
}

// GetProjectByID godoc
//
//	@Summary		Get a project by ID
//	@Tags			projects
//	@Produce		json
//	@Param			id	path		string	true	"Project UUID"
//	@Success		200	{object}	dto.ProjectResponse
//	@Failure		400	{object}	map[string]string
//	@Failure		401	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/projects/{id} [get]
//	@Security		BearerAuth
func (h *ProjectHandler) GetProjectByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	project, err := h.projectService.GetProjectByID(id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, project)
}

// GetProjectDetailsByID godoc
//
//	@Summary		Get full project details including roles (visibility-filtered)
//	@Tags			projects
//	@Produce		json
//	@Param			id	path		string	true	"Project UUID"
//	@Success		200	{object}	dto.ProjectDetailsResponse
//	@Failure		400	{object}	map[string]string
//	@Failure		401	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/projects/{id}/details [get]
//	@Security		BearerAuth
func (h *ProjectHandler) GetProjectDetailsByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	details, err := h.projectService.GetProjectDetailsByID(id, callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, details)
}

// GetProjectApplications godoc
//
//	@Summary		List all applications for a project (owner only)
//	@Tags			projects
//	@Produce		json
//	@Param			id	path		string	true	"Project UUID"
//	@Success		200	{array}		dto.ApplicationDetailResponse
//	@Failure		401	{object}	map[string]string
//	@Failure		403	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/projects/{id}/applications [get]
//	@Security		BearerAuth
func (h *ProjectHandler) GetProjectApplications(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	applications, err := h.projectService.GetProjectApplications(id, callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, applications)
}

// UpdateProject godoc
//
//	@Summary		Update a project (owner only)
//	@Tags			projects
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"Project UUID"
//	@Param			body	body		dto.UpdateProjectRequest	true	"Project data"
//	@Success		200		{object}	dto.ProjectResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string
//	@Router			/projects/{id} [put]
//	@Security		BearerAuth
func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.UpdateProjectRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.projectService.UpdateProject(id, callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

// DeleteProject godoc
//
//	@Summary		Delete a project (owner only)
//	@Tags			projects
//	@Param			id	path	string	true	"Project UUID"
//	@Success		204
//	@Failure		401	{object}	map[string]string
//	@Failure		403	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/projects/{id} [delete]
//	@Security		BearerAuth
func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	if err := h.projectService.DeleteProject(id, callerID); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
