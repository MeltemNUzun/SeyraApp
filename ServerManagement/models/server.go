package models

import "database/sql"

// ServerType model representing a server type in the system.
type ServerType struct {
	ServerTypeId   int    `json:"server_type_id"`
	ServerTypeName string `json:"server_type_name"`
}

type Server struct {
	ServerId       int            `json:"server_id"`
	ServerName     string         `json:"server_name"`
	ServerTypeId   int            `json:"server_type_id"`
	IPAddress      string         `json:"ip_address"`
	ServerUsername sql.NullString `json:"server_username"`
	ServerPassword sql.NullString `json:"server_password"`
}
