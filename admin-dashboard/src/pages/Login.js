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
          withCredentials: true, // allow cookies if needed
        }
      );

      if (response.data.message === 'Login successful') {
        const token = response.data.token;

        // Store the token in memory or local storage (consider security implications)
        localStorage.setItem('auth_token', token);

        // Show success notification
        showNotification('Login successful', 'success');
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Show error notification
      showNotification('Invalid credentials', 'error');
    }
  };

  // Function to show notifications
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Function to close notifications
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
          {/* Logo Area */}
          <Avatar
            sx={{
              bgcolor: '#9C27B0',
              width: 80,
              height: 80,
              marginBottom: 2,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 40 }} />
          </Avatar>

          {/* Login Heading */}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 'bold',
              fontSize: '2.5rem',
              color: '#6A1B9A',
              marginBottom: '30px',
              fontFamily: "'Poppins', sans-serif", // Font from Google Fonts
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Light shadow effect
            }}
          >
            LOGIN
          </Typography>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
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
              label="Password"
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
              Login
            </Button>
          </form>

          {/* Forgot Password Link */}
          <Typography sx={{ marginTop: '20px' }}>
            <Link href="/forgot-password" variant="body2" sx={{ color: '#6A1B9A', textDecoration: 'underline' }}>
              Forgot your password?
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