package handler

import (
	"net/http"

	"juntae-api/internal/domain/dto"
	"juntae-api/internal/domain/service"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req dto.CreateUserRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.userService.CreateUser(req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusCreated, resp)
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	users, err := h.userService.GetUsers()
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, users)
}

func (h *UserHandler) GetUserByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	user, err := h.userService.GetUserByID(id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var req dto.UpdateUserRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.userService.UpdateUser(id, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.userService.DeleteUser(id); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
