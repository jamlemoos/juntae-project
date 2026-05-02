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
	offset, limit := parsePagination(c)
	projects, err := h.projectService.GetProjectsForList(callerID, status, city, offset, limit)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, projects)
}

func (h *ProjectHandler) GetMyProjects(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	offset, limit := parsePagination(c)
	projects, err := h.projectService.GetProjectsForOwner(callerID, offset, limit)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, projects)
}

func (h *ProjectHandler) CountApplicationsByProject(c *gin.Context) {
	results, err := h.projectService.CountApplicationsByProject()
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, results)
}

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
