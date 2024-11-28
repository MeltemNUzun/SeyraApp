import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
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
      window.location.href = '/login'; // Giriş sayfasına yönlendirme
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      alert("Çıkış yapılamadı.");
    }
  };

  return (
    <Box sx={commonBackgroundStyle}>
      <Container component="main" maxWidth="md">
        {/* SEYRA Başlığı ve Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '70px', // Yukarı taşımak için azaltıldı
          }}
        >
          {/* Oval Logo */}
          <img
            src={`${process.env.PUBLIC_URL}/seyra-logo.png`}
            alt="Seyra Logo"
            style={{
              width: '120px', // Logonun genişliği
              height: '120px', // Logonun yüksekliği
              borderRadius: '50%', // Oval görünüm
              marginRight: '15px', // Logo ile "SEYRA" yazısı arasındaki boşluk
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Hafif gölge efekti
            }}
          />
          {/* SEYRA Yazısı */}
          <Box>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#ffffff',
                fontFamily: "'Poppins', sans-serif",
                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
              }}
            >
              SEYRA
            </Typography>
            {/* Alt Başlık */}
            <Typography
              component="h2"
              variant="subtitle1"
              sx={{
                fontWeight: '400',
                color: '#F3F4F6',
                fontFamily: "'Roboto', sans-serif",
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
              }}
            >
              Sunucu Yönetim Sistemi
            </Typography>
          </Box>
        </Box>

        {/* Sayfa Başlığı */}
<Box textAlign="center" mb={4}>
  <Typography
    component="h2"
    variant="h4"
    sx={{
      color: '#ffffff', // Beyaz renk
      fontWeight: 'bold', // Kalın yazı
      fontStyle: 'italic', // İtalik yazı
      fontFamily: "'Poppins', sans-serif", // Modern font
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.6)', // Gölgeli efekt
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


        {/* Yönetim Kartları */}
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

        {/* Çıkış Butonu */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ padding: '10px 20px', fontWeight: 'bold', borderRadius: '12px' }}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
