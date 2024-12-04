import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Avatar, Snackbar, Alert } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/forgot-password', { email });
      showNotification(`Şifre sıfırlama bağlantısı ${email} adresine gönderildi.`, 'success');
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      showNotification('E-posta doğrulanamadı. Lütfen tekrar deneyin.', 'error');
    }
  };

  const handleBackToLogin = () => {
    navigate('/'); // Kullanıcıyı login sayfasına geri döndürür
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
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
        {/* Başlık ve İkon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#9C27B0',
              width: 60,
              height: 60,
              marginRight: '10px',
            }}
          >
            <MailOutlineIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 'bold',
              fontSize: '2rem',
              color: '#6A1B9A',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Şifremi Unuttum
          </Typography>
        </Box>

        {/* Form */}
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
  );
}

export default ForgotPassword;
