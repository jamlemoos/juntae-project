package config

import (
	"fmt"
	"os"
)

type Config struct {
	AppPort          string
	MainDatabaseURL  string
	AuditDatabaseURL string
}

func Load() (*Config, error) {
	appPort := os.Getenv("PORT")
	if appPort == "" {
		appPort = os.Getenv("APP_PORT")
	}
	if appPort == "" {
		appPort = "8080"
	}

	mainDatabaseURL := os.Getenv("MAIN_DATABASE_URL")
	if mainDatabaseURL == "" {
		mainDatabaseURL = os.Getenv("DATABASE_URL")
	}
	if mainDatabaseURL == "" {
		return nil, fmt.Errorf("MAIN_DATABASE_URL (or DATABASE_URL) environment variable is required")
	}

	auditDatabaseURL := os.Getenv("AUDIT_DATABASE_URL")
	if auditDatabaseURL == "" {
		return nil, fmt.Errorf("AUDIT_DATABASE_URL environment variable is required")
	}

	return &Config{
		AppPort:          appPort,
		MainDatabaseURL:  mainDatabaseURL,
		AuditDatabaseURL: auditDatabaseURL,
	}, nil
}
