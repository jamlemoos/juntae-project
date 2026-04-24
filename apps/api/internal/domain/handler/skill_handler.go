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

func (h *SkillHandler) GetSkills(c *gin.Context) {
	skills, err := h.skillService.GetSkills()
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, skills)
}

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
