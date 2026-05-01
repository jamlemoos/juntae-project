package security

import (
	"crypto/rand"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var jwtSecret []byte

func InitJWT() error {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		if os.Getenv("APP_ENV") == "development" {
			random := make([]byte, 32)
			if _, err := rand.Read(random); err != nil {
				return fmt.Errorf("failed to generate dev JWT secret: %w", err)
			}
			jwtSecret = random
			log.Println("WARN: JWT_SECRET not set — using random secret for this run (tokens won't survive restart)")
			return nil
		}
		return fmt.Errorf("JWT_SECRET must be set")
	}
	jwtSecret = []byte(secret)
	return nil
}

func getTokenTTL() time.Duration {
	if val := os.Getenv("JWT_TTL_HOURS"); val != "" {
		if hours, err := strconv.Atoi(val); err == nil && hours > 0 {
			return time.Duration(hours) * time.Hour
		}
	}
	return 24 * time.Hour
}

type CustomClaims struct {
	UserID uuid.UUID `json:"user_id"`
	Role   string    `json:"role"`
	jwt.RegisteredClaims
}

func ValidateToken(tokenString string) (*CustomClaims, error) {
	if len(jwtSecret) == 0 {
		return nil, fmt.Errorf("jwt not initialized")
	}
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}
	return claims, nil
}

func GenerateToken(userID uuid.UUID, role string) (string, error) {
	if len(jwtSecret) == 0 {
		return "", fmt.Errorf("jwt not initialized: call security.InitJWT() on startup")
	}
	now := time.Now()
	claims := CustomClaims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(getTokenTTL())),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
