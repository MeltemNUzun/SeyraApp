import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Snackbar, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleResetPassword = async () => {
    try {
      await axios.post(`http://localhost:8080/api/v1/reset-password`, { token, password });
      setNotification({ open: true, message: 'Şifre başarıyla değiştirildi.', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Şifre değiştirilemedi.', severity: 'error' });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Şifreyi Sıfırla
      </Typography>
      <TextField
        label="Yeni Şifre"
        fullWidth
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleResetPassword}>
        Şifreyi Güncelle
      </Button>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};
export default ResetPassword;

