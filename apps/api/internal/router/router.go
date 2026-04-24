package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"juntae-api/internal/domain/handler"
	"juntae-api/internal/domain/service"
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
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "juntae-api",
		})
	})

	userHandler := handler.NewUserHandler(deps.UserService)
	skillHandler := handler.NewSkillHandler(deps.SkillService)
	projectHandler := handler.NewProjectHandler(deps.ProjectService)
	projectRoleHandler := handler.NewProjectRoleHandler(deps.ProjectRoleService)
	applicationHandler := handler.NewApplicationHandler(deps.ApplicationService)

	api := r.Group("/api")

	// Users
	api.POST("/users", userHandler.CreateUser)
	api.GET("/users", userHandler.GetUsers)
	api.GET("/users/:id", userHandler.GetUserByID)
	api.PUT("/users/:id", userHandler.UpdateUser)
	api.DELETE("/users/:id", userHandler.DeleteUser)

	// Skills
	api.POST("/skills", skillHandler.CreateSkill)
	api.GET("/skills", skillHandler.GetSkills)
	api.GET("/skills/:id", skillHandler.GetSkillByID)
	api.PUT("/skills/:id", skillHandler.UpdateSkill)
	api.DELETE("/skills/:id", skillHandler.DeleteSkill)

	// Projects — static routes must be registered before :id
	api.POST("/projects", projectHandler.CreateProject)
	api.GET("/projects", projectHandler.GetProjects)
	api.GET("/projects/search", projectHandler.SearchProjectsByStatusAndCreatorCity)
	api.GET("/projects/applications-count", projectHandler.CountApplicationsByProject)
	api.GET("/projects/:id", projectHandler.GetProjectByID)
	api.GET("/projects/:id/details", projectHandler.GetProjectDetailsByID)
	api.PUT("/projects/:id", projectHandler.UpdateProject)
	api.DELETE("/projects/:id", projectHandler.DeleteProject)

	// Project Roles
	api.POST("/project-roles", projectRoleHandler.CreateProjectRole)
	api.GET("/project-roles", projectRoleHandler.GetProjectRoles)
	api.GET("/project-roles/:id", projectRoleHandler.GetProjectRoleByID)
	api.PUT("/project-roles/:id", projectRoleHandler.UpdateProjectRole)
	api.DELETE("/project-roles/:id", projectRoleHandler.DeleteProjectRole)

	// Applications
	api.POST("/applications", applicationHandler.CreateApplication)
	api.GET("/applications", applicationHandler.GetApplications)
	api.GET("/applications/:id", applicationHandler.GetApplicationByID)
	api.PUT("/applications/:id", applicationHandler.UpdateApplication)
	api.DELETE("/applications/:id", applicationHandler.DeleteApplication)

	return r
}
