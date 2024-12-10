package models

import (
	"database/sql"
	"time"
)

type Log struct {
	LogId      int            `json:"log_id"`
	LogTypeId  int            `json:"log_type_id"`
	Timestamp  time.Time      `json:"timestamp"`
	Message    string         `json:"message"`
	Importance sql.NullString `json:"importance"` // Null ise JSON'da gösterilmez
	ServerId   int            `json:"server_id"`
}
