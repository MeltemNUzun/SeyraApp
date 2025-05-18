package handlers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/exec"
	"server-management/database"
	"time"

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

	cmd := exec.Command("python", "deepsek.py", tmpFile.Name(), req.Message)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		log.Println("DeepSEK stderr:", stderr.String())
		log.Println("DeepSEK stdout:", stdout.String())

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "DeepSEK çalıştırılamadı",
			"details": stderr.String(),
		})
		return
	}

	var jsonResp map[string]interface{}
	if err := json.Unmarshal(stdout.Bytes(), &jsonResp); err != nil {
		log.Println("Çıktı JSON değil:", stdout.String())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Yanıt JSON formatında değil"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"answer": jsonResp["response"]})

}

func AnalyzeLogsByRange(c *gin.Context) {
	var req struct {
		ServerID int    `json:"server_id"`
		Range    string `json:"range"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz JSON"})
		return
	}

	var since time.Time
	now := time.Now().Local()

	switch req.Range {
	case "daily":
		since = now.AddDate(0, 0, -1)
	case "weekly":
		since = now.AddDate(0, 0, -7)
	case "monthly":
		since = now.AddDate(0, -1, 0)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz analiz türü"})
		return
	}

	until := now
	query := `SELECT Message FROM logs WHERE ServerId = @p1 AND Timestamp BETWEEN @p2 AND @p3`
	rows, err := database.DB.Query(query, req.ServerID, since, until)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Veritabanı hatası", "details": err.Error()})
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
		c.JSON(http.StatusOK, gin.H{"answer": "Seçilen tarih aralığında log bulunamadı."})
		return
	}

	tmpFile, err := os.CreateTemp("", "range_logs_*.txt")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Dosya oluşturulamadı"})
		return
	}
	defer os.Remove(tmpFile.Name())

	for _, line := range logs {
		tmpFile.WriteString(line + "\n")
	}
	tmpFile.Close()

	cmd := exec.Command("python", "deepsek.py", tmpFile.Name(), req.Range)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		log.Println("DeepSEK stderr:", stderr.String())
		log.Println("DeepSEK stdout:", stdout.String())

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "DeepSEK çalıştırılamadı",
			"details": stderr.String(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"answer": stdout.String()})
}
