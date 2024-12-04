import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh', // Ekran yüksekliğini tam kapsar
        background: 'linear-gradient(135deg, #D16BA5, #86A8E7, #5FFBF1)',
        padding: 0,
        margin: 0,
        overflowY: 'auto', // Kaydırma çubuğunu etkinleştirir
      }}
    >
      {/* Sabit SEYRA Başlığı ve Logo */}
      <Box
        sx={{
          position: 'fixed', // Sabit hale getirir
          top: '0px', // Sayfanın en üstüne yapışık
          width: '99%', // Tam genişlikte
          zIndex: 1000, // Üstte kalır
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Hafif şeffaf arka plan
          padding: '15px 0', // Üst ve alt boşluk
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/seyra-logo.png`}
          alt="Seyra Logo"
          style={{
            width: '120px',
            height: '120px',
            marginRight: '15px',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          }}
        />
        <Box>
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#6A1B9A',
              fontFamily: "'Poppins', sans-serif",
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
            }}
          >
            SEYRA
          </Typography>
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{
              fontWeight: '400',
              color: '#333',
              fontFamily: "'Roboto', sans-serif",
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
            }}
          >
            Sunucu Yönetim Sistemi
          </Typography>
        </Box>
      </Box>

      {/* Sayfa İçeriği */}
      <Box
        sx={{
          marginTop: '200px', // Sabit logonun ve başlıkların altına içerik yerleştirilir
          width: '100%',
          padding: '20px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
