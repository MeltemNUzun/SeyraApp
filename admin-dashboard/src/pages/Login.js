import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper, Avatar, Link, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/login`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.message === 'Login successful') {
        const token = response.data.token;
        const passwordResetRequired = response.data.passwordResetRequired; // passwordResetRequired bilgisi alınıyor

        localStorage.setItem('auth_token', token);
        showNotification('Login successful', 'success');

        if (passwordResetRequired) {
          // Şifre değiştirme ekranına yönlendirme
          navigate('/change-password');
        } else {
          // Ana sayfaya yönlendirme
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Invalid credentials', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

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
        {/* SEYRA Başlık ve Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Logo */}
          <img
            src={`${process.env.PUBLIC_URL}/seyra-logo.png`}
            alt="Seyra Logo"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              marginRight: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          />
          {/* SEYRA Yazısı */}
          <Box>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 'bold',
                fontSize: '3rem',
                color: '#ffffff',
                fontFamily: "'Poppins', sans-serif",
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
              }}
            >
              SEYRA
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#F3F4F6',
                fontSize: '1.2rem',
                marginTop: '5px',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Sunucu Yönetim Sistemi
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={8}
          sx={{
            padding: '60px',
            borderRadius: '16px',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
          }}
        >
          {/* Giriş Yap Bölümü */}
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
                width: 80, // Avatar büyütüldü
                height: 80, // Avatar büyütüldü
                marginRight: '15px', // Yazıdan uzaklık
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 40, color: '#ffffff' }} />
            </Avatar>
            <Typography
              component="h2"
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#6A1B9A',
                fontFamily: "'Poppins', sans-serif",
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                fontSize: '2.0rem',
              }}
            >
              Giriş Yap
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Kullanıcı Adı"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Giriş Yap
            </Button>
          </form>

          {/* Forgot Password Link */}
          <Typography sx={{ marginTop: '20px' }}>
            <Link href="/forgot-password" variant="body2" sx={{ color: '#6A1B9A', textDecoration: 'underline' }}>
              Şifremi Unuttum
            </Link>
          </Typography>
        </Paper>

        {/* Notification Area */}
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
      </Container>
    </Box>
  );
}

export default Login;
