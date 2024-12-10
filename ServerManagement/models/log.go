package models

import (
	"database/sql"
	"time"
)

type Log struct {
	LogId       int       `json:"log_id"`
	LogTypeId   int       `json:"log_type_id"`
	LogTypeName string    `json:"log_type_name"` // Log tipi adı
	Timestamp   time.Time `json:"timestamp"`
	Message     string    `json:"message"`
	Importance  string    `json:"importance,omitempty"`
	ServerId    int       `json:"server_id"`
}

// Importance için dönüşüm
func (l *Log) UnmarshalLog(importance sql.NullString) {
	if importance.Valid {
		l.Importance = importance.String
	} else {
		l.Importance = "" // Null değerler için boş string
	}
}
