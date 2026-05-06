package service

import (
	"errors"
	"fmt"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserProfileService struct {
	repo *repository.UserProfileRepository
}

func NewUserProfileService(repo *repository.UserProfileRepository) *UserProfileService {
	return &UserProfileService{repo: repo}
}

func (s *UserProfileService) GetProfile(userID uuid.UUID) (*dto.UserProfileResponse, error) {
	profile, err := s.repo.FindByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &dto.UserProfileResponse{
				UserID:       userID,
				Headline:     "",
				Availability: "available",
			}, nil
		}
		return nil, fmt.Errorf("get profile: %w", err)
	}
	resp := mapUserProfileResponse(profile)
	return &resp, nil
}

func (s *UserProfileService) UpsertProfile(userID uuid.UUID, req dto.UpsertUserProfileRequest) (*dto.UserProfileResponse, error) {
	availability := req.Availability
	if availability == "" {
		availability = "available"
	}
	profile := &model.UserProfile{
		UserID:       userID,
		Headline:     req.Headline,
		Availability: availability,
	}
	if err := s.repo.Upsert(profile); err != nil {
		return nil, fmt.Errorf("upsert profile: %w", err)
	}
	resp := mapUserProfileResponse(profile)
	return &resp, nil
}

func mapUserProfileResponse(p *model.UserProfile) dto.UserProfileResponse {
	return dto.UserProfileResponse{
		ID:           p.ID,
		UserID:       p.UserID,
		Headline:     p.Headline,
		Availability: p.Availability,
		CreatedAt:    p.CreatedAt,
		UpdatedAt:    p.UpdatedAt,
	}
}
