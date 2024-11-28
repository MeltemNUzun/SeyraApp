package services

import (
	"server-management/logger"
	"server-management/models"
	"server-management/repository"

	"go.uber.org/zap"
)

// AddServer adds a new server to the system.
func AddServer(server models.Server) error {
	err := repository.AddServer(server)
	if err != nil {
		logger.Logger().Error("Error adding server", zap.Error(err))
		return err
	}
	return nil
}

// GetServers fetches servers based on the user role.
func GetServers(userRole int) ([]models.Server, error) {
	servers, err := repository.GetServers(userRole)
	if err != nil {
		logger.Logger().Error("Error fetching servers", zap.Error(err))
		return nil, err
	}
	return servers, nil

}

func DeleteServer(serverID int) error {
	err := repository.DeleteServerById(serverID)
	if err != nil {
		logger.Logger().Error("Error deleting servers", zap.Error(err))
		return err
	}
	return nil

}

/*func GetLogsByServerId(serverID int) ([]models.Log, error) {
	logs, err := repository.GetLogsByServerId(serverID)
	if err != nil {
		logger.Logger().Error("Error fetching logs", zap.Error(err))
		return nil, err
	}
	return logs, nil
}*/
