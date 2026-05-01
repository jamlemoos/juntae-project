package service

import (
	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
)

func mapPublicUserResponse(u *model.User) dto.PublicUserResponse {
	skills := make([]dto.SkillResponse, len(u.Skills))
	for i := range u.Skills {
		skills[i] = mapSkillResponse(&u.Skills[i])
	}
	return dto.PublicUserResponse{
		ID:        u.ID,
		Name:      u.Name,
		City:      u.City,
		Skills:    skills,
		CreatedAt: u.CreatedAt,
	}
}
