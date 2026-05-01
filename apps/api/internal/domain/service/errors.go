package service

import "errors"

var (
	ErrForbidden = errors.New("forbidden")
	ErrConflict  = errors.New("conflict")
)
