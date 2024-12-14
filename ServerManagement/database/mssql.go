package database

import (
	"database/sql"
	"fmt"
	"os"
	"server-management/logger"

	"go.uber.org/zap"

	_ "github.com/denisenkom/go-mssqldb" // SQL Server driver
)

// DB is the global database connection pool
var DB *sql.DB

func Setup() {
	var err error

	// Retrieve database connection parameters from environment variables
	server := os.Getenv("DB_SERVER")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	database := os.Getenv("DB_NAME")

	// Check if any of the required environment variables are missing
	if server == "" || port == "" || user == "" || password == "" || database == "" {
		logger.Logger().Fatal("Database connection parameters missing in environment variables")
	}

	// Build the connection string
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%s;database=%s;encrypt=true;trustServerCertificate=true",
		server, user, password, port, database)

	// Open the database connection
	DB, err = sql.Open("sqlserver", connString)
	if err != nil {
		logger.Logger().Fatal("Error creating connection pool", zap.Error(err))
	}

	// Verify the connection is valid
	err = DB.Ping()
	if err != nil {
		logger.Logger().Fatal("Error connecting to the database", zap.Error(err))
	}

	logger.Logger().Info("Successfully connected to the database")
}

// Disconnect closes the database connection pool
func Disconnect() {
	if DB != nil {
		err := DB.Close()
		if err != nil {
			logger.Logger().Error("Error closing the database connection", zap.Error(err))
		} else {
			logger.Logger().Info("Database connection closed")
		}
	}
}
