package router

import (
	"net/http"

	"juntae-api/internal/domain/handler"
	"juntae-api/internal/domain/service"
	"juntae-api/internal/middleware"

	"github.com/gin-gonic/gin"
)

type RouterDependencies struct {
	UserService        *service.UserService
	SkillService       *service.SkillService
	ProjectService     *service.ProjectService
	ProjectRoleService *service.ProjectRoleService
	ApplicationService *service.ApplicationService
}

func SetupRouter(deps RouterDependencies) *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "juntae-api"})
	})

	userHandler := handler.NewUserHandler(deps.UserService)
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
	protected.GET("/users/:id", userHandler.GetUserByID)
	protected.PUT("/users/:id", userHandler.UpdateUser)
	protected.DELETE("/users/:id", userHandler.DeleteUser)

	protected.POST("/skills", skillHandler.CreateSkill)
	protected.PUT("/skills/:id", skillHandler.UpdateSkill)
	protected.DELETE("/skills/:id", skillHandler.DeleteSkill)

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

	protected.GET("/project-roles", projectRoleHandler.GetProjectRoles)
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
