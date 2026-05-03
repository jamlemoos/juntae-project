package service

import (
	"fmt"
	"net/url"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/model"
	"juntae-api/internal/domain/repository"

	"github.com/google/uuid"
)

type UserLinkService struct {
	repo *repository.UserLinkRepository
}

func NewUserLinkService(repo *repository.UserLinkRepository) *UserLinkService {
	return &UserLinkService{repo: repo}
}

func (s *UserLinkService) GetLinks(userID uuid.UUID) ([]dto.UserLinkResponse, error) {
	links, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("get links: %w", err)
	}
	responses := make([]dto.UserLinkResponse, len(links))
	for i := range links {
		responses[i] = mapUserLinkResponse(&links[i])
	}
	return responses, nil
}

func (s *UserLinkService) CreateLink(userID uuid.UUID, req dto.CreateUserLinkRequest) (*dto.UserLinkResponse, error) {
	if err := validateHTTPURL(req.URL); err != nil {
		return nil, err
	}
	link := &model.UserLink{
		UserID: userID,
		Kind:   req.Kind,
		Label:  req.Label,
		URL:    req.URL,
	}
	if err := s.repo.Create(link); err != nil {
		return nil, fmt.Errorf("create link: %w", err)
	}
	resp := mapUserLinkResponse(link)
	return &resp, nil
}

func (s *UserLinkService) UpdateLink(id, userID uuid.UUID, req dto.UpdateUserLinkRequest) (*dto.UserLinkResponse, error) {
	if err := validateHTTPURL(req.URL); err != nil {
		return nil, err
	}
	link, err := s.repo.FindByIDAndUserID(id, userID)
	if err != nil {
		return nil, fmt.Errorf("link not found: %w", err)
	}
	link.Kind = req.Kind
	link.Label = req.Label
	link.URL = req.URL
	if err := s.repo.Update(link); err != nil {
		return nil, fmt.Errorf("update link: %w", err)
	}
	resp := mapUserLinkResponse(link)
	return &resp, nil
}

func (s *UserLinkService) DeleteLink(id, userID uuid.UUID) error {
	if err := s.repo.Delete(id, userID); err != nil {
		return fmt.Errorf("delete link: %w", err)
	}
	return nil
}

// validateHTTPURL rejects any URL whose scheme is not http or https.
// The struct-level `validate:"url"` tag ensures basic URL syntax before this is called.
func validateHTTPURL(rawURL string) error {
	u, err := url.ParseRequestURI(rawURL)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") {
		return ErrValidation
	}
	return nil
}

func mapUserLinkResponse(l *model.UserLink) dto.UserLinkResponse {
	return dto.UserLinkResponse{
		ID:        l.ID,
		Kind:      l.Kind,
		Label:     l.Label,
		URL:       l.URL,
		CreatedAt: l.CreatedAt,
		UpdatedAt: l.UpdatedAt,
	}
}
