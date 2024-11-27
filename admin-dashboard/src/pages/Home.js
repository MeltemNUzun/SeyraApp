import React from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button, Grid, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import api from "../axiosConfig";

// Ortak arka plan stilini tanımlayın
const commonBackgroundStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #D16BA5, #86A8E7, #5FFBF1)',
};

function Home() {
  // Çıkış işlemi
  const handleLogout = async () => {
    try {
      const response = await api.post('http://127.0.0.1:8080/api/v1/logout');
      alert(response.data.message); // "Logout successful" mesajını gösterir
      // Başarılı çıkıştan sonra, kullanıcıyı giriş sayfasına yönlendirebilirsiniz
      window.location.href = '/login'; // Giriş sayfası rotanızı buraya yazın
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      alert("Çıkış yapılamadı.");
    }
  };

  return (
    <Box sx={commonBackgroundStyle}>
      <Container component="main" maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={4}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ color: '#6A1B9A', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>
            Welcome to the Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: '20px', color: '#333' }}>
            Manage users, servers, and other administrative settings with ease.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                padding: '20px',
                fontWeight: 'bold',
                backgroundColor: '#D16BA5',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  backgroundColor: '#C2185B',
                },
              }}
              href="/user-management"
            >
              <Avatar sx={{ bgcolor: 'transparent', color: '#fff', marginBottom: '8px' }}>
                <PersonIcon />
              </Avatar>
              User Management
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                padding: '20px',
                fontWeight: 'bold',
                backgroundColor: '#86A8E7',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  backgroundColor: '#5A7FB3',
                },
              }}
              href="/server-management"
            >
              <Avatar sx={{ bgcolor: 'transparent', color: '#fff', marginBottom: '8px' }}>
                <StorageIcon />
              </Avatar>
              Server Management
            </Button>
          </Grid>
        </Grid>

        {/* Çıkış Butonu */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ padding: '10px 20px', fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
