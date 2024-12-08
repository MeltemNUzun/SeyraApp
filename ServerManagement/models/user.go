package models

// User model representing a user in the system.
type User struct {
	UserId                int    `json:"user_id"`
	Username              string `json:"username"`
	PasswordHash          string `json:"password_hash"`
	RoleId                int    `json:"role_id"`
	Email                 string `json:"email"`
	PasswordResetRequired bool   `json:"password_reset_required"` // Yeni alan
}
