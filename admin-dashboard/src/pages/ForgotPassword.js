import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Avatar, Snackbar, Alert } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Backend işlemleri daha sonra eklenecek
    showNotification(`Şifre sıfırlama bağlantısı ${email} adresine gönderildi`, 'success');

  };

  const handleBackToLogin = () => {
    navigate('/'); // Kullanıcıyı login sayfasına geri döndürür
  };

  // Bildirimleri gösterme fonksiyonu
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Bildirim kapatma işlemi
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #D16BA5, #86A8E7, #5FFBF1)',
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: '60px',
            borderRadius: '16px',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#9C27B0',
              width: 80,
              height: 80,
              marginBottom: 2,
            }}
          >
            <MailOutlineIcon sx={{ fontSize: 40 }} />
          </Avatar>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 'bold',
              fontSize: '2.5rem',
              color: '#6A1B9A',
              marginBottom: '30px',
              fontFamily: "'Poppins', sans-serif",
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            Şifremi Unuttum
          </Typography>

          <form onSubmit={handleForgotPassword} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-Posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                marginTop: '30px',
                padding: '12px',
                fontWeight: 'bold',
                borderRadius: '10px',
                backgroundColor: '#D16BA5',
                '&:hover': {
                  backgroundColor: '#C2185B',
                },
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              Sıfırlama Linki Gönder
            </Button>
          </form>

          {/* Geri Dön Butonu */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBackToLogin}
            sx={{
              marginTop: '20px',
              fontWeight: 'bold',
              borderRadius: '10px',
            }}
          >
            Giriş Sayfasına Geri Dön
          </Button>

          {/* Bildirim Alanı */}
          <Snackbar
            open={notification.open}
            autoHideDuration={4000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;