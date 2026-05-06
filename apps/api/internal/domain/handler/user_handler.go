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

// CreateUser godoc
//
//	@Summary		Register a new user
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		dto.CreateUserRequest	true	"Registration data"
//	@Success		201		{object}	dto.UserResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		409		{object}	map[string]string	"Email already in use"
//	@Router			/auth/register [post]
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

// GetMe godoc
//
//	@Summary		Get current authenticated user
//	@Tags			users
//	@Produce		json
//	@Success		200	{object}	dto.UserResponse
//	@Failure		401	{object}	map[string]string
//	@Router			/users/me [get]
//	@Security		BearerAuth
func (h *UserHandler) GetMe(c *gin.Context) {
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	user, err := h.userService.GetUserByID(callerID)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, user)
}

// GetUsers godoc
//
//	@Summary		List all users (public profiles)
//	@Tags			users
//	@Produce		json
//	@Success		200	{array}		dto.PublicUserResponse
//	@Failure		401	{object}	map[string]string
//	@Router			/users [get]
//	@Security		BearerAuth
func (h *UserHandler) GetUsers(c *gin.Context) {
	users, err := h.userService.GetUsers()
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, users)
}

// GetUserByID godoc
//
//	@Summary		Get public profile of a user by ID
//	@Tags			users
//	@Produce		json
//	@Param			id	path		string	true	"User UUID"
//	@Success		200	{object}	dto.PublicUserResponse
//	@Failure		400	{object}	map[string]string
//	@Failure		401	{object}	map[string]string
//	@Failure		404	{object}	map[string]string
//	@Router			/users/{id} [get]
//	@Security		BearerAuth
func (h *UserHandler) GetUserByID(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	user, err := h.userService.GetPublicUserByID(id)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, user)
}

// UpdateUser godoc
//
//	@Summary		Update own user data (name, email, bio, city, skills)
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"User UUID"
//	@Param			body	body		dto.UpdateUserRequest	true	"User update data"
//	@Success		200		{object}	dto.UserResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string
//	@Failure		403		{object}	map[string]string
//	@Router			/users/{id} [put]
//	@Security		BearerAuth
func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	var req dto.UpdateUserRequest
	if !bindAndValidate(c, &req) {
		return
	}
	resp, err := h.userService.UpdateUser(id, callerID, req)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, resp)
}

// DeleteUser godoc
//
//	@Summary		Delete own account
//	@Tags			users
//	@Param			id	path	string	true	"User UUID"
//	@Success		204
//	@Failure		401	{object}	map[string]string
//	@Failure		403	{object}	map[string]string
//	@Router			/users/{id} [delete]
//	@Security		BearerAuth
func (h *UserHandler) DeleteUser(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	callerID, ok := getAuthUserID(c)
	if !ok {
		return
	}
	if err := h.userService.DeleteUser(id, callerID); err != nil {
		handleServiceError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

// Login godoc
//
//	@Summary		Authenticate and receive JWT
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			body	body		handler.loginRequest	true	"Credentials"
//	@Success		200		{object}	handler.loginResponse
//	@Failure		400		{object}	map[string]string
//	@Failure		401		{object}	map[string]string	"Invalid credentials"
//	@Router			/auth/login [post]
func (h *UserHandler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"    validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}
	if !bindAndValidate(c, &req) {
		return
	}
	token, user, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		handleServiceError(c, err)
		return
	}
	respondWithJSON(c, http.StatusOK, gin.H{
		"token": token,
		"user":  user,
	})
}

type loginRequest struct {
	Email    string `json:"email"    example:"user@example.com"`
	Password string `json:"password" example:"supersecret"`
}

type loginResponse struct {
	Token string           `json:"token"`
	User  dto.UserResponse `json:"user"`
}
