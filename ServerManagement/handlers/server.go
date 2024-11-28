package handlers

import (
	"database/sql"
	"net/http"
	"server-management/logger"
	"server-management/models"
	"server-management/services"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// AddServer adds a new server to the system.
func AddServer(c *gin.Context) {
	// Check if the user is authorized to add a new server
	userRoleId, exists := c.Get("role_id")
	if !exists {
		logger.Logger().Error("User role not found in token")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	// Only admin can add a new server
	if userRoleId != 1 {
		logger.Logger().Error("Unauthorized user attempting to add a server")
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to perform this action"})
		return
	}

	var req struct {
		ServerName     string `json:"server_name"`
		ServerTypeId   int    `json:"server_type_id"`
		IPAddress      string `json:"ip_address"`
		Vendor         string `json:"vendor"`
		ServerUsername string `json:"server_username"`
		ServerPassword string `json:"server_password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	server := models.Server{
		ServerName:   req.ServerName,
		ServerTypeId: req.ServerTypeId,
		IPAddress:    req.IPAddress,
		Vendor:       req.Vendor,
		ServerUsername: sql.NullString{
			String: req.ServerUsername,
			Valid:  req.ServerUsername != "", // Boş değilse Valid true
		},
		ServerPassword: sql.NullString{
			String: req.ServerPassword,
			Valid:  req.ServerPassword != "", // Boş değilse Valid true
		},
	}

	err := services.AddServer(server)
	if err != nil {
		logger.Logger().Error("Error adding server", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error adding server"})
		return
	}

	logger.Logger().Info("Server added successfully", zap.String("server_name", server.ServerName))
	c.JSON(http.StatusOK, gin.H{"message": "Server added successfully"})
}

// Servers handles the request to get allowed servers.
func Servers(c *gin.Context) {
	// Check role_id in token
	userRoleId, exists := c.Get("role_id")
	if !exists {
		logger.Logger().Error("User role not found in token")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	// Get servers based on user role
	servers, err := services.GetServers(userRoleId.(int))
	if err != nil {
		logger.Logger().Error("Error fetching servers", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching servers"})
		return
	}

	logger.Logger().Info("Servers fetched successfully")
	c.JSON(http.StatusOK, servers) // Sunucu bilgilerini JSON formatında döndür
}

func DeleteServer(c *gin.Context) {
	// Get request parameter
	serverIdStr := c.Param("server_id")

	// Convert serverId from string to int
	serverId, err := strconv.Atoi(serverIdStr)
	if err != nil {
		logger.Logger().Error("Invalid server_id", zap.Int("server_id", serverId))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server_id"})
		return
	}

	err = services.DeleteServer(serverId)
	if err != nil {
		logger.Logger().Error("Error deleting server", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting server"})
		return
	}

	logger.Logger().Info("Server deleted successfully")
	c.JSON(http.StatusOK, nil)
}
