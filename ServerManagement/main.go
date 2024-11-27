package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"os"
	"server-management/database"
	"server-management/logger"
	"server-management/routes"
)

func init() {
	// Load the environment variables
	err := godotenv.Load("server_management.env")
	if err != nil {
		logger.Logger().Debug("server_management.env file not found, using system environment variables")
	}

	logger.Logger().Info(os.Getenv("DB_SERVER"))
	logger.Logger().Info(os.Getenv("DB_PORT"))
	logger.Logger().Info(os.Getenv("DB_USER"))
	logger.Logger().Info(os.Getenv("DB_PASSWORD"))
	logger.Logger().Info(os.Getenv("DB_NAME"))
	logger.Logger().Info(os.Getenv("JWT_SECRET"))

	// Connect to the database
	database.Setup()
}

func main() {

	// Start the server
	err := routes.StartServer()
	if err != nil {
		logger.Logger().Error(fmt.Sprintf("error starting server: %s", err))
		os.Exit(1)
	}

	// Defer the logger sync
	defer logger.Logger().Sync()
	// Defer the database disconnect
	defer database.Disconnect()
}
