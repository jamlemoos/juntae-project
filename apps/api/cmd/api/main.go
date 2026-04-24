package main

import (
	"log"

	"juntae-api/internal/config"
	"juntae-api/internal/database"
	"juntae-api/internal/domain/repository"
	"juntae-api/internal/domain/service"
	"juntae-api/internal/router"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading environment variables directly")
	}

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	mainDB, err := database.ConnectMainDatabase(cfg.MainDatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to main database: %v", err)
	}
	log.Println("Connected to main database")

	if err := database.RunMainMigrations(mainDB); err != nil {
		log.Fatalf("Failed to run main migrations: %v", err)
	}
	log.Println("Main migrations applied")

	auditDB, err := database.ConnectAuditDatabase(cfg.AuditDatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to audit database: %v", err)
	}
	log.Println("Connected to audit database")

	if err := database.RunAuditMigrations(auditDB); err != nil {
		log.Fatalf("Failed to run audit migrations: %v", err)
	}
	log.Println("Audit migrations applied")

	auditRepo := repository.NewAuditRepository(auditDB)
	userRepo := repository.NewUserRepository(mainDB)
	skillRepo := repository.NewSkillRepository(mainDB)
	projectRepo := repository.NewProjectRepository(mainDB)
	projectRoleRepo := repository.NewProjectRoleRepository(mainDB)
	applicationRepo := repository.NewApplicationRepository(mainDB)

	auditService := service.NewAuditService(auditRepo)
	userService := service.NewUserService(userRepo, skillRepo, auditService)
	skillService := service.NewSkillService(skillRepo, auditService)
	projectService := service.NewProjectService(projectRepo, auditService)
	projectRoleService := service.NewProjectRoleService(projectRoleRepo, auditService)
	applicationService := service.NewApplicationService(applicationRepo, auditService)

	deps := router.RouterDependencies{
		UserService:        userService,
		SkillService:       skillService,
		ProjectService:     projectService,
		ProjectRoleService: projectRoleService,
		ApplicationService: applicationService,
	}

	r := router.SetupRouter(deps)

	log.Printf("Starting juntae-api on port %s", cfg.AppPort)
	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
