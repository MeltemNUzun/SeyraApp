package services

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"errors"
	"server-management/logger"
	"server-management/middlewares"
	"server-management/models"
	"server-management/repository"

	"go.uber.org/zap"
)

// hashPasswordSHA256 hashes a password using SHA-256.
func hashPasswordSHA256(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// AuthenticateUser authenticates a user by checking the username and password.
func AuthenticateUser(username, password string) (string, error) {
	user, err := repository.GetUserByUsername(username)
	if err != nil {
		logger.Logger().Error("Error fetching user by username", zap.Error(err))
		return "", err
	}

	// Hash the provided password and compare with the stored hash
	hashedPassword := hashPasswordSHA256(password)
	if hashedPassword != user.PasswordHash {
		return "", errors.New("invalid password")
	}

	// Generate JWT Token
	token, err := middlewares.GenerateToken(user.RoleId)
	if err != nil {
		logger.Logger().Error("Error generating token", zap.Error(err))
		return "", err
	}

	return token, nil
}

// RegisterUser registers a new user in the system.
func RegisterUser(username, password string, roleId int, email string) error {

	// Hash the password using SHA-256
	passwordHash := hashPasswordSHA256(password)

	// Add user to the repository
	err := repository.AddUser(username, passwordHash, email, roleId)
	if err != nil {
		logger.Logger().Error("Error adding user", zap.Error(err))
		return err
	}

	return nil
}

// DeleteUser deletes a user from the system.
func DeleteUser(id int) error {

	err := repository.DeleteUser(id)
	if err != nil {
		logger.Logger().Error("Error deleting user", zap.Error(err))
		return err
	}
	return nil

}

// GetUsers fetches all users from the repository.
func GetUsers() ([]models.User, error) {
	users, err := repository.GetUsers()
	if err != nil {
		logger.Logger().Error("Error fetching users", zap.Error(err))
		return nil, err
	}
	return users, nil
}

// UpdateUserRole updates the role of a user in the system.
func UpdateUserRole(userId int, roleId int) error {
	err := repository.UpdateUserRole(userId, roleId)
	if err != nil {
		logger.Logger().Error("Error updating user role", zap.Error(err))
		return err
	}
	return nil
}
func VerifyEmail(email string) (bool, error) {
	// E-posta doğrulama işlemini buraya yazın
	if email == "" {
		return false, errors.New("e-posta boş olamaz")
	}
	// Örneğin, e-posta formatı kontrol edilebilir
	return true, nil // Gerçek doğrulama işlemi burada yapılmalı
}
func UpdateUserPassword(userID int, password string) error {
	// Hash the password here if needed
	hashedPassword := password // Şifre hashing kütüphanesi kullanılabilir

	// Veritabanı bağlantısı ve şifre güncelleme işlemleri
	db, err := sql.Open("mysql", "user:password@tcp(localhost:3306)/dbname")
	if err != nil {
		logger.Logger().Error("Error connecting to the database", zap.Error(err))
		return err
	}
	defer db.Close()

	_, err = db.Exec("UPDATE users SET password = ? WHERE id = ?", hashedPassword, userID)
	if err != nil {
		logger.Logger().Error("Error updating password", zap.Error(err))
		return err
	}

	return nil
}
