package services

import (
	"fmt"
	"net/smtp"
)

var mailConfig = MailConfig{
	SMTPHost: "smtp.gmail.com", // SMTP sunucusu
	SMTPPort: "587",            // SMTP portu (TLS için genellikle 587 kullanılır)
	Username: "gulermelihemre@gmail.com",
	Password: "",
	From:     "gulermelihemre@gmail.com",
}
var M = NewMailService(mailConfig)

// MailConfig yapılandırmasını tutar
type MailConfig struct {
	SMTPHost string
	SMTPPort string
	Username string
	Password string
	From     string
}

// MailService e-posta gönderme servisi
type MailService struct {
	Config MailConfig
}

// NewMailService yeni bir MailService oluşturur
func NewMailService(config MailConfig) *MailService {
	return &MailService{
		Config: config,
	}
}

// SendEmail bir e-posta gönderir
func (ms *MailService) SendEmail(to []string, subject, body string) error {
	// E-posta başlıklarını ayarla
	headers := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n", ms.Config.From, to, subject)
	message := headers + body

	// SMTP Sunucusuna bağlan
	auth := smtp.PlainAuth("", ms.Config.Username, ms.Config.Password, ms.Config.SMTPHost)
	err := smtp.SendMail(
		ms.Config.SMTPHost+":"+ms.Config.SMTPPort,
		auth,
		ms.Config.From,
		to,
		[]byte(message),
	)
	if err != nil {
		return fmt.Errorf("error sending email: %w", err)
	}

	return nil
}
