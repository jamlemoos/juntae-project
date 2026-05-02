package service

import (
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
)

var (
	ErrForbidden     = errors.New("forbidden")
	ErrConflict      = errors.New("conflict")
	ErrProjectClosed = errors.New("project closed")
	ErrRoleClosed    = errors.New("role closed")
)

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}
