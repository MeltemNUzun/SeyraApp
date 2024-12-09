package repository

import (
	"database/sql"
	"errors"
	"server-management/database"
	"server-management/logger"
	"server-management/models"

	"go.uber.org/zap"
)

// GetUserByUsername fetches a user by their username.
func GetUserByUsername(username string) (*models.User, error) {
	user := &models.User{}
	err := database.DB.QueryRow(
		"SELECT UserId, Username, PasswordHash, RoleId, PasswordResetRequired FROM dbo.Users WHERE Username = @Username",
		sql.Named("Username", username),
	).Scan(&user.UserId, &user.Username, &user.PasswordHash, &user.RoleId, &user.PasswordResetRequired)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		logger.Logger().Error("Error fetching user by username", zap.Error(err))
		return nil, err
	}
	return user, nil
}

// GetUserIdByEmailAddress fetches a user by their email address.
func GetUserIdByEmailAddress(email string) (int, error) {
	var userId int
	err := database.DB.QueryRow(
		"SELECT UserId FROM dbo.Users WHERE Email = @Email",
		sql.Named("Email", email),
	).Scan(&userId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, errors.New("user not found")
		}
		logger.Logger().Error("Error fetching user by email", zap.Error(err))
		return 0, err
	}
	return userId, nil
}

// AddUser adds a new user to the system.
func AddUser(username, passwordHash, email string, roleId int) error {
	_, err := database.DB.Exec(
		`INSERT INTO dbo.Users (Username, PasswordHash, RoleId, Email, PasswordResetRequired) 
		 VALUES (@Username, @PasswordHash, @RoleId, @Email, @PasswordResetRequired)`,
		sql.Named("Username", username),
		sql.Named("PasswordHash", passwordHash),
		sql.Named("RoleId", roleId),
		sql.Named("Email", email),
		sql.Named("PasswordResetRequired", true), // Yeni kullanıcılar için zorunlu
	)
	if err != nil {
		logger.Logger().Error("Error adding user", zap.Error(err))
		return err
	}
	return nil
}

// Update User Password
func UpdateUserPassword(userId int, hashedPassword string) error {
	_, err := database.DB.Exec(
		`UPDATE dbo.Users 
		 SET PasswordHash = @PasswordHash, PasswordResetRequired = @PasswordResetRequired
		 WHERE UserId = @UserId`,
		sql.Named("PasswordHash", hashedPassword),
		sql.Named("PasswordResetRequired", false), // Şifre değiştirildikten sonra zorunluluk kaldırılıyor
		sql.Named("UserId", userId),
	)
	return err
}

// DeleteUser deletes a user from the system.
func DeleteUser(userId int) error {
	_, err := database.DB.Exec(
		"DELETE FROM dbo.Users WHERE UserId = @UserId",
		sql.Named("UserId", userId),
	)
	if err != nil {
		logger.Logger().Error("Error deleting user", zap.Error(err))
		return err
	}
	return nil
}

func GetUsers() (users []models.User, err error) {
	rows, err := database.DB.Query("SELECT UserId, Username, RoleId FROM dbo.Users")
	if err != nil {
		logger.Logger().Error("Error fetching users", zap.Error(err))
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		err = rows.Scan(&user.UserId, &user.Username, &user.RoleId)
		if err != nil {
			logger.Logger().Error("Error scanning user", zap.Error(err))
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil

}

// UpdateUserRole updates the role of a user.
func UpdateUserRole(userId, roleId int) error {
	_, err := database.DB.Exec(
		"UPDATE dbo.Users SET RoleId = @RoleId WHERE UserId = @UserId",
		sql.Named("RoleId", roleId),
		sql.Named("UserId", userId),
	)
	if err != nil {
		logger.Logger().Error("Error updating user role", zap.Error(err))
		return err
	}
	return nil
}
