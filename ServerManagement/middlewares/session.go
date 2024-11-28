package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"os"
	"time"
)

// Secret key for signing JWT tokens - this should be kept secure.
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Claims struct for the JWT, containing standard claims and custom RoleId.
type Claims struct {
	RoleId int `json:"role_id"`
	jwt.RegisteredClaims
}

// GenerateToken generates a new JWT token for a given role ID.
func GenerateToken(roleId int) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // Token expires in 24 hours.
	claims := &Claims{
		RoleId: roleId, // roleId doğru olarak burada atanmalı
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// ValidateToken middleware to validate incoming requests with JWT token.
func ValidateToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		// First check if there is a token in the Authorization header
		tokenString := c.GetHeader("Authorization")

		// If there is no token in the Authorization header, check from cookies
		if tokenString == "" {
			tokenCookie, err := c.Cookie("auth_token")
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
				c.Abort()
				return
			}
			tokenString = tokenCookie
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Set role ID to context, can be used in handlers to identify role of the user
		c.Set("role_id", claims.RoleId)
		fmt.Printf("Role ID from token: %d\n", claims.RoleId)
		c.Next()
	}
}
