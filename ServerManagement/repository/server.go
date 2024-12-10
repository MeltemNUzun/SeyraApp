package repository

import (
	"database/sql"
	"fmt"
	"server-management/database"
	"server-management/logger"
	"server-management/models"

	"go.uber.org/zap"
)

// AddServer adds a new server to the system.
func AddServer(server models.Server) error {
	_, err := database.DB.Exec(
		"INSERT INTO dbo.Server (ServerName, ServerTypeId, IPAddress,Vendor, ServerUsername, ServerPassword) VALUES (@ServerName, @ServerTypeId, @IPAddress,@Vendor, @ServerUsername, @ServerPassword)",
		sql.Named("ServerName", server.ServerName),
		sql.Named("ServerTypeId", server.ServerTypeId),
		sql.Named("IPAddress", server.IPAddress),
		sql.Named("Vendor", server.Vendor),
		sql.Named("ServerUsername", server.ServerUsername),
		sql.Named("ServerPassword", server.ServerPassword),
	)
	if err != nil {
		logger.Logger().Error("Error adding server", zap.Error(err))
		return err
	}
	return nil
}

// GetServers fetches servers based on the user role.
func GetServers(role int) ([]models.Server, error) {
	var servers []models.Server
	var rows *sql.Rows
	var err error

	if role == 1 {
		rows, err = database.DB.Query("SELECT ServerId, ServerName, ServerTypeId, IPAddress, ServerUsername, ServerPassword FROM dbo.Server")
	} else {
		rows, err = database.DB.Query("SELECT ServerId, ServerName, ServerTypeId, IPAddress, ServerUsername, ServerPassword FROM dbo.Server WHERE ServerTypeId = @UserRoleId",
			sql.Named("UserRoleId", role),
		)
	}

	if err != nil {
		logger.Logger().Error("Error fetching servers", zap.Error(err))
		return nil, err
	}
	defer rows.Close() // rows kapama ekleyerek açık bağlantıları yönet

	for rows.Next() {
		var server models.Server
		var serverUsername sql.NullString // NULL değer için sql.NullString kullan

		// Scan işlemi sırasında hata kontrolü ekledik
		err = rows.Scan(&server.ServerId, &server.ServerName, &server.ServerTypeId, &server.IPAddress, &serverUsername, &server.ServerPassword)
		if err != nil {
			logger.Logger().Error("Error scanning server", zap.Error(err))
			return nil, err
		}

		// Kullanım
		server.ServerUsername = sql.NullString{
			String: serverUsername.String,
			Valid:  true, // Değer geçerli olduğu için true
		}
		servers = append(servers, server)
	}

	return servers, nil
}

func DeleteServerById(serverId int) error {
	// Sunucuyu silme işlemi
	result, err := database.DB.Exec("DELETE FROM dbo.Server WHERE ServerId = @ServerId",
		sql.Named("ServerId", serverId),
	)
	if err != nil {
		logger.Logger().Error("Error deleting server", zap.Error(err))
		return err
	}

	// Silinen satır sayısını kontrol etme
	rowsDeleted, _ := result.RowsAffected()
	if rowsDeleted == 0 {
		logger.Logger().Warn("No server found with the given ID", zap.Int("ServerId", serverId))
		return fmt.Errorf("no server found with ID %d", serverId)
	}

	logger.Logger().Info("Server deleted successfully", zap.Int("ServerId", serverId))
	return nil
}

// GetLogsByServerId sunucu ID'sine göre logları getirir
func GetLogsByServerId(serverId int) ([]models.Log, error) {
	var logs []models.Log
	var rows *sql.Rows
	var err error

	// Veritabanı sorgusu
	rows, err = database.DB.Query(
		`SELECT 
			logs.LogId, 
			logs.LogTypeId, 
			log_types.Name AS LogTypeName, 
			logs.Timestamp, 
			logs.Message, 
			logs.Importance, 
			logs.ServerId
		 FROM 
			dbo.Logs logs
		 JOIN 
			dbo.LogTypes log_types 
		 ON 
			logs.LogTypeId = log_types.Id
		 WHERE 
			logs.ServerId = @ServerId`,
		sql.Named("ServerId", serverId),
	)

	if err != nil {
		logger.Logger().Error("Error fetching logs", zap.Error(err))
		return nil, err
	}
	defer rows.Close() // Açık bağlantıları kapatmak için eklenmiştir

	// Veritabanı sonuçlarını okuma
	for rows.Next() {
		var log models.Log
		var importance sql.NullString // importance için sql.NullString kullanımı

		// Satırı okuma ve modele yerleştirme
		err := rows.Scan(
			&log.LogId,
			&log.LogTypeId,
			&log.LogTypeName, // Yeni alan
			&log.Timestamp,
			&log.Message,
			&importance,
			&log.ServerId,
		)
		if err != nil {
			logger.Logger().Error("Error scanning log", zap.Error(err))
			return nil, err
		}

		// Importance alanını dönüştür
		if importance.Valid {
			log.Importance = importance.String
		} else {
			log.Importance = ""
		}

		// importance alanını log.Importance'a doğru şekilde atama
		log.UnmarshalLog(importance)

		// Log'u listeye ekle
		logs = append(logs, log)
	}

	// Herhangi bir hata oluştuysa kontrol
	if err = rows.Err(); err != nil {
		logger.Logger().Error("Error after fetching logs", zap.Error(err))
		return nil, err
	}

	return logs, nil // Log listesi döndür
}
