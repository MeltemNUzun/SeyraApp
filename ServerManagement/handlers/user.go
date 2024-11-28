package handlers

import (
	"fmt"
	"net/http"
	"server-management/logger"
	"server-management/repository"
	"server-management/services"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

var jwtSecret = []byte("your_secret_key")

// getRoleIdFromContext extracts the role_id from the context securely.
func getRoleIdFromContext(c *gin.Context) (int, error) {
	roleIdValue, exists := c.Get("role_id")
	if !exists {
		return 0, fmt.Errorf("role_id not found in context")
	}

	roleId, ok := roleIdValue.(int)
	if !ok {
		return 0, fmt.Errorf("role_id is not of type int")
	}

	return roleId, nil
}

// Login handles the login request by authenticating the user and returning a token.
func Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Logger().Error("Invalid request body", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Authenticate the user and get the token
	token, err := services.AuthenticateUser(req.Username, req.Password)
	if err != nil {
		logger.Logger().Error("Error authenticating user", zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Error authenticating user"})
		return
	}

	cookie := &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/",
		Domain:   "localhost",
		Expires:  time.Now().Add(1 * time.Hour),
		Secure:   true, // Set to false if not using HTTPS in development
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode, // Set SameSite to None
	}
	http.SetCookie(c.Writer, cookie)

	c.SetCookie("auth_token", token, 3600, "/", "localhost", false, true) // Secure and HttpOnly set appropriately

	// Send response with the token in JSON
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
	})
}

// Register handles the registration of a new user.
func Register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
		RoleId   int    `json:"role_id"`
		Email    string `json:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Logger().Error("Invalid request body", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Check if the user is authorized to register a new user
	userRoleId, err := getRoleIdFromContext(c)
	if err != nil {
		logger.Logger().Error("User role not found in token", zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	// Only admin users can register new users
	if userRoleId != 1 {
		logger.Logger().Error("Unauthorized user attempting to register another user")
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to perform this action"})
		return
	}

	// Check if the new user is an admin
	if req.RoleId == 1 {
		logger.Logger().Error("User role selected as admin, role_id: 1")
		c.JSON(http.StatusForbidden, gin.H{"error": "User role permission denied"})
		return
	}

	err = services.RegisterUser(req.Username, req.Password, req.RoleId, req.Email)
	if err != nil {
		logger.Logger().Error("Error registering user", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering user"})
		return
	}

	logger.Logger().Info("User registered successfully", zap.String("username", req.Username))
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

// DeleteUser handles the deletion of a user.
func DeleteUser(c *gin.Context) {
	// Get request parameter
	userIdStr := c.Param("user_id")
	fmt.Println("user_id:", userIdStr)

	// Convert userId from string to int
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		logger.Logger().Error("Invalid user_id", zap.String("user_id", userIdStr))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user_id"})
		return
	}

	// Check if the user is authorized to delete a user
	userRoleId, err := getRoleIdFromContext(c)
	if err != nil {
		logger.Logger().Error("User role not found in token", zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	// Only admin users can delete users
	if userRoleId != 1 {
		logger.Logger().Error("Unauthorized user attempting to delete another user")
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to perform this action"})
		return
	}

	err = services.DeleteUser(userId)
	if err != nil {
		logger.Logger().Error("Error deleting user", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting user"})
		return
	}

	logger.Logger().Info("User deleted successfully", zap.Int("user_id", userId))
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// Users handles the request to get all users.
func Users(c *gin.Context) {
	// Check if the user is authorized to view all users
	userRoleId, err := getRoleIdFromContext(c)
	if err != nil {
		logger.Logger().Error("User role not found in token", zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	// Only admin users can view all users
	if userRoleId != 1 {
		logger.Logger().Error("Unauthorized user attempting to view all users")
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to perform this action"})
		return
	}

	users, err := services.GetUsers()
	if err != nil {
		logger.Logger().Error("Error fetching users", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching users"})
		return
	}

	logger.Logger().Info("Users fetched successfully")
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// UpdateUserRole handles the request to update the role of a user.
func UpdateUserRole(c *gin.Context) {
	var req struct {
		UserId int `json:"user_id"`
		RoleId int `json:"role_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Logger().Error("Invalid request body", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Check if the user is authorized to update the role of a user
	userRoleId, err := getRoleIdFromContext(c)
	if err != nil {
		logger.Logger().Error("User role not found in token", zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	// Only admin users can update the role of a user
	if userRoleId != 1 {
		logger.Logger().Error("Unauthorized user attempting to update role of another user")
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to perform this action"})
		return
	}

	err = services.UpdateUserRole(req.UserId, req.RoleId)
	if err != nil {
		logger.Logger().Error("Error updating user role", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating user role"})
		return
	}

	logger.Logger().Info("User role updated successfully", zap.Int("user_id", req.UserId), zap.Int("role_id", req.RoleId))
	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully"})
}

// Logout handles the logout request by clearing the token cookie.
func Logout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true) // Secure and HttpOnly set appropriately
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

// Reset Password Handler
func ResetPasswordHandler(c *gin.Context) {
	var req struct {
		Token    string `json:"token"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Logger().Error("Invalid request body", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Parse and validate the token
	token, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
		// Token'ı imzalamak için kullanılan secret anahtarını döndürür
		return jwtSecret, nil
	})

	if err != nil {
		logger.Logger().Error("Error parsing token", zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := int(claims["userID"].(float64))

		// Hash the new password (optional)
		hashedPassword := services.HashPasswordSHA256(req.Password)

		// Update the password in the database
		err = repository.UpdateUserPassword(userID, hashedPassword)
		if err != nil {
			logger.Logger().Error("Error updating password", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Password could not be updated"})
			return
		}

		logger.Logger().Info("Password updated successfully", zap.Int("user_id", userID))
		c.JSON(http.StatusOK, gin.H{"message": "Password successfully updated"})
	}
}

func ForgotPasswordHandler(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Logger().Error("Invalid request body", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Logic for sending password reset link
	userID, err := services.VerifyEmail(req.Email)
	if err != nil {
		logger.Logger().Error("Error verifying email", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error verifying email"})
		return
	}

	// Generate a reset token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(15 * time.Minute).Unix(),
	})
	tokenString, _ := token.SignedString(jwtSecret)

	//add code to send email
	err = services.M.SendEmail([]string{req.Email}, "Password Reset", "Click the link to reset your password: http://localhost:3000/reset-password/"+tokenString)
	if err != nil {
		logger.Logger().Error("Error sending email", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error sending email"})
		return
	}

	// Send the reset email (email sending logic should be added here)
	logger.Logger().Info("Password reset link sent", zap.String("email", req.Email))
	c.JSON(http.StatusOK, gin.H{"message": "Password reset link sent", "reset_token": tokenString})
}
