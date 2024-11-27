package models

// Role model representing a role in the system.
type Role struct {
	RoleId       int    `json:"role_id"`
	RoleName     string `json:"role_name"`
	ServerTypeId int    `json:"server_type_id"`
}
