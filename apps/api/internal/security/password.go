package security

import (
	"errors"
	"fmt"
	"os"
	"strconv"

	"golang.org/x/crypto/bcrypt"
)

func bcryptCost() int {
	costValue := os.Getenv("BCRYPT_COST")
	if costValue == "" {
		return bcrypt.DefaultCost
	}

	cost, err := strconv.Atoi(costValue)
	if err != nil {
		return bcrypt.DefaultCost
	}

	if cost < bcrypt.MinCost || cost > bcrypt.MaxCost {
		return bcrypt.DefaultCost
	}

	return cost
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost())
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func CheckPasswordHash(password, hash string) (bool, error) {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    if err != nil {
        if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
            return false, nil
        }
        return false, fmt.Errorf("unexpected security error: %w", err)
    }
    return true, nil
}