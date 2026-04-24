package validation

import "github.com/go-playground/validator/v10"

var validate = validator.New()

func ValidateStruct(input any) error {
	return validate.Struct(input)
}
