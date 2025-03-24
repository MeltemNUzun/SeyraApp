package handlers

import (
	"bytes"
	"log"
	"net/http"
	"os"
	"os/exec"
	"server-management/database"

	"github.com/gin-gonic/gin"
)

func AnalyzeMessage(c *gin.Context) {
	var req struct {
		Message  string `json:"message"`
		ServerID int    `json:"server_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz JSON"})
		return
	}

	// MSSQL: server_id'ye göre logları al
	rows, err := database.DB.Query("SELECT Message FROM logs WHERE ServerId = @p1", req.ServerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Veritabanı hatası"})
		return
	}
	defer rows.Close()

	var logs []string
	for rows.Next() {
		var msg string
		if err := rows.Scan(&msg); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Satır okunamadı"})
			return
		}
		logs = append(logs, msg)
	}

	if len(logs) == 0 {
		c.JSON(http.StatusOK, gin.H{"answer": "Bu sunucuya ait log bulunamadı."})
		return
	}

	// Geçici dosyaya logları yaz
	tmpFile, err := os.CreateTemp("", "logs_*.txt")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Dosya oluşturulamadı"})
		return
	}
	defer os.Remove(tmpFile.Name())

	for _, line := range logs {
		tmpFile.WriteString(line + "\n")
	}
	tmpFile.Close()

	// Python scripti çağır (deepsek.py)
	cmd := exec.Command("python", "deepsek.py", tmpFile.Name())

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		log.Println("DeepSEK stderr:", stderr.String()) // terminale yaz
		log.Println("DeepSEK stdout:", stdout.String())

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "DeepSEK çalıştırılamadı",
			"details": stderr.String(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"answer": stdout.String()})
}
