package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
)

type SkillHandler struct {
	skillService *service.SkillService
}

func NewSkillHandler(skillService *service.SkillService) *SkillHandler {
	return &SkillHandler{skillService: skillService}
}

// CreateSkill godoc
//
//	@Summary		Create a skill (admin only)
//	@Tags			skills
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.CreateSkillRequest	true	"Skill data"
//	@Success		201		{object}	dto.SkillResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string	"Admin role required"
//	@Failure		409		{object}	map[string]string	"Skill already exists"
//	@Router			/skills [post]
//	@Security		BearerAuth
func (h *SkillHandler) CreateSkill(c *gin.Context) {
	var req dto.CreateSkillRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.skillService.CreateSkill(req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, resp)
}

// GetSkills godoc
//
//	@Summary		List all skills (public)
//	@Tags			skills
//	@Produce		json
//	@Success		200	{array}		dto.SkillResponse
//	@Router			/skills [get]
func (h *SkillHandler) GetSkills(c *gin.Context) {
	skills, err := h.skillService.GetSkills()
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, skills)
}

// GetSkillByID godoc
//
//	@Summary		Get a skill by ID (public)
//	@Tags			skills
//	@Produce		json
//	@Param			id	path		string	true	"Skill UUID"
//	@Success		200	{object}	dto.SkillResponse
//	@Failure		400	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/skills/{id} [get]
func (h *SkillHandler) GetSkillByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	skill, err := h.skillService.GetSkillByID(id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, skill)
}

// UpdateSkill godoc
//
//	@Summary		Update a skill (admin only)
//	@Tags			skills
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"Skill UUID"
//	@Param			body	body		dto.UpdateSkillRequest	true	"Skill data"
//	@Success		200		{object}	dto.SkillResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string
//	@Failure		404		{object}	map[string]string
//	@Router			/skills/{id} [put]
//	@Security		BearerAuth
func (h *SkillHandler) UpdateSkill(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var req dto.UpdateSkillRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.skillService.UpdateSkill(id, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

// DeleteSkill godoc
//
//	@Summary		Delete a skill (admin only)
//	@Tags			skills
//	@Param			id	path	string	true	"Skill UUID"
//	@Success		204
//	@Failure		401	{object}	map[string]string
//	@Failure		403	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/skills/{id} [delete]
//	@Security		BearerAuth
func (h *SkillHandler) DeleteSkill(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.skillService.DeleteSkill(id); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
