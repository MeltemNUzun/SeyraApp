import React, { useState } from 'react';
import { Container, Typography, Box, Button, Grid, Snackbar, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import api from "../axiosConfig";

function Home() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

  const handleLogout = async () => {
    try {
      const response = await api.post('http://127.0.0.1:8080/api/v1/logout');
      setNotification({
        open: true,
        message: response.data.message,
        severity: 'success',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500); // Redirect after 1.5 seconds
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      setNotification({
        open: true,
        message: "Çıkış yapılamadı.",
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      {/* Logout Button */}
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{
          position: 'fixed',
          top: '160px',
          right: '25px',
          display: 'flex',
          padding: '10px 20px',
          fontWeight: 'bold',
          borderRadius: '12px',
        }}
      >
        Logout
      </Button>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000} // Closes after 4 seconds
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Container
        component="main"
        maxWidth="md"
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography
            component="h2"
            variant="h4"
            sx={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontFamily: "'Poppins', sans-serif",
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.6)',
            }}
          >
            Welcome to Seyra
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#F3F4F6',
              fontSize: '1rem',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Manage users, servers, and administrative tasks effortlessly.
          </Typography>
        </Box>

        {/* Management Cards */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                padding: '20px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #6a1b9a, #d16ba5)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4a148c, #b12d9a)',
                },
              }}
              href="/user-management"
            >
              <PersonIcon sx={{ fontSize: 40, marginBottom: '8px' }} />
              <Typography>User Management</Typography>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                padding: '20px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #1e88e5, #86a8e7)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #5c9ed9)',
                },
              }}
              href="/server-management"
            >
              <StorageIcon sx={{ fontSize: 40, marginBottom: '8px' }} />
              <Typography>Server Management</Typography>
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Home;
