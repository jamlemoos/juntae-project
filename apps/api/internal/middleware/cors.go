package middleware

import (
	"net/http"
	"slices"
	"strings"

	"github.com/gin-gonic/gin"
)

// CORSMiddleware sets CORS headers for requests from allowed origins.
// allowedOrigins must already be normalized (TrimSpace, no trailing slash).
// Only exact-match origins receive CORS headers — no wildcard.
func CORSMiddleware(allowedOrigins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Normalize incoming Origin the same way configured origins are normalized.
		origin := strings.TrimRight(strings.TrimSpace(c.GetHeader("Origin")), "/")
		c.Header("Vary", "Origin")
		if origin != "" && slices.Contains(allowedOrigins, origin) {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Authorization,Content-Type")
			// Access-Control-Allow-Credentials is intentionally omitted:
			// this API uses JWT in Authorization headers, not cookies.
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
