package handlers

import (
	"net/http"
	"server-management/logger"
	"server-management/services"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// Dashboard istatistiklerini döndüren API
func GetDashboardStats(c *gin.Context) {
	serverIdStr := c.Param("server_id")
	serverId, err := strconv.Atoi(serverIdStr)
	if err != nil {
		logger.Logger().Error("Geçersiz sunucu ID", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz sunucu ID"})
		return
	}

	stats, err := services.GetDashboardStats(serverId)
	if err != nil {
		logger.Logger().Error("Dashboard verileri alınırken hata oluştu", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Dashboard verileri alınamadı"})
		return
	}

	c.JSON(http.StatusOK, stats)
}
