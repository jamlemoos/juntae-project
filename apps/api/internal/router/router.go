package router

import (
	"log"
	"net/http"
	"os"
	"strings"

	"juntae-api/internal/domain/handler"
	"juntae-api/internal/domain/service"
	"juntae-api/internal/middleware"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type RouterDependencies struct {
	UserService        *service.UserService
	UserLinkService    *service.UserLinkService
	UserProfileService *service.UserProfileService
	SkillService       *service.SkillService
	ProjectService     *service.ProjectService
	ProjectRoleService *service.ProjectRoleService
	ApplicationService *service.ApplicationService
}

var defaultOrigins = []string{
	"http://localhost:5173",
	"http://127.0.0.1:5173",
}

// normalizeOrigin trims whitespace and removes a trailing slash.
func normalizeOrigin(o string) string {
	return strings.TrimRight(strings.TrimSpace(o), "/")
}

func resolveAllowedOrigins() []string {
	raw := os.Getenv("ALLOWED_ORIGINS")
	if raw == "" {
		return defaultOrigins
	}
	appEnv := os.Getenv("APP_ENV")
	var origins []string
	for _, o := range strings.Split(raw, ",") {
		normalized := normalizeOrigin(o)
		if normalized == "" {
			continue
		}
		if normalized == "*" && appEnv == "production" {
			log.Println("[CORS] wildcard '*' is not permitted in production — skipping")
			continue
		}
		origins = append(origins, normalized)
	}
	if len(origins) == 0 {
		return defaultOrigins
	}
	return origins
}

func SetupRouter(deps RouterDependencies) *gin.Engine {
	r := gin.Default()

	allowedOrigins := resolveAllowedOrigins()
	log.Printf("[CORS] allowed origins: %v", allowedOrigins)
	r.Use(middleware.CORSMiddleware(allowedOrigins))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "juntae-api"})
	})
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	userHandler := handler.NewUserHandler(deps.UserService)
	userLinkHandler := handler.NewUserLinkHandler(deps.UserLinkService)
	userProfileHandler := handler.NewUserProfileHandler(deps.UserProfileService)
	skillHandler := handler.NewSkillHandler(deps.SkillService)
	projectHandler := handler.NewProjectHandler(deps.ProjectService)
	projectRoleHandler := handler.NewProjectRoleHandler(deps.ProjectRoleService)
	applicationHandler := handler.NewApplicationHandler(deps.ApplicationService)

	api := r.Group("/api")

	auth := api.Group("/auth")
	auth.POST("/register", userHandler.CreateUser)
	auth.POST("/login", userHandler.Login)

	api.GET("/skills", skillHandler.GetSkills)
	api.GET("/skills/:id", skillHandler.GetSkillByID)

	protected := api.Group("", middleware.RequireAuth())

	protected.GET("/users", userHandler.GetUsers)
	protected.GET("/users/me", userHandler.GetMe)
	protected.GET("/users/me/profile", userProfileHandler.GetMyProfile)
	protected.PUT("/users/me/profile", userProfileHandler.UpsertProfile)
	protected.GET("/users/me/links", userLinkHandler.GetMyLinks)
	protected.POST("/users/me/links", userLinkHandler.CreateLink)
	protected.PUT("/users/me/links/:id", userLinkHandler.UpdateLink)
	protected.DELETE("/users/me/links/:id", userLinkHandler.DeleteLink)
	protected.GET("/users/:id", userHandler.GetUserByID)
	protected.PUT("/users/:id", userHandler.UpdateUser)
	protected.DELETE("/users/:id", userHandler.DeleteUser)

	adminOnly := protected.Group("", middleware.RequireRole("admin"))
	adminOnly.POST("/skills", skillHandler.CreateSkill)
	adminOnly.PUT("/skills/:id", skillHandler.UpdateSkill)
	adminOnly.DELETE("/skills/:id", skillHandler.DeleteSkill)

	protected.GET("/projects/stats/applications-count", projectHandler.CountApplicationsByProject)
	protected.GET("/projects/me", projectHandler.GetMyProjects)
	protected.GET("/projects", projectHandler.GetProjects)
	protected.POST("/projects", projectHandler.CreateProject)
	protected.GET("/projects/:id", projectHandler.GetProjectByID)
	protected.GET("/projects/:id/details", projectHandler.GetProjectDetailsByID)
	protected.GET("/projects/:id/applications", projectHandler.GetProjectApplications)
	protected.GET("/projects/:id/roles", projectRoleHandler.GetRolesByProject)
	protected.PUT("/projects/:id", projectHandler.UpdateProject)
	protected.DELETE("/projects/:id", projectHandler.DeleteProject)

	protected.POST("/project-roles", projectRoleHandler.CreateProjectRole)
	protected.GET("/project-roles/:id", projectRoleHandler.GetProjectRoleByID)
	protected.PUT("/project-roles/:id", projectRoleHandler.UpdateProjectRole)
	protected.DELETE("/project-roles/:id", projectRoleHandler.DeleteProjectRole)

	protected.POST("/applications", applicationHandler.CreateApplication)
	protected.GET("/applications", applicationHandler.GetApplications)
	protected.GET("/applications/:id", applicationHandler.GetApplicationByID)
	protected.PUT("/applications/:id", applicationHandler.UpdateApplication)
	protected.PATCH("/applications/:id/status", applicationHandler.UpdateApplicationStatus)
	protected.DELETE("/applications/:id", applicationHandler.DeleteApplication)

	return r
}
