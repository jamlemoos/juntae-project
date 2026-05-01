package middleware

import (
	"net/http"
	"strings"

	"juntae-api/internal/security"

	"github.com/gin-gonic/gin"
)

const (
	ContextKeyUserID = "auth_user_id"
	ContextKeyRole   = "auth_role"
)

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
			return
		}
		tokenString := strings.TrimPrefix(header, "Bearer ")
		claims, err := security.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}
		c.Set(ContextKeyUserID, claims.UserID)
		c.Set(ContextKeyRole, claims.Role)
		c.Next()
	}
}
