package models

import (
	"database/sql"
	"time"
)

// Log, sistemdeki bir log kaydını temsil eder
type Log struct {
	LogId      int            `json:"log_id"`      // Birincil anahtar
	LogTypeId  int            `json:"log_type_id"` // LogTypes tablosuna yabancı anahtar
	Timestamp  time.Time      `json:"timestamp"`   // Logun oluşturulma zamanı
	Message    string         `json:"message"`     // Log mesajı
	Importance sql.NullString `json:"Importance"`  // Log Importance
	ServerId   int            `json:"server_id"`   // Server tablosuna yabancı anahtar
}
