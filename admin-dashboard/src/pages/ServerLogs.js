import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../axiosConfig';

// Ortak arka plan stili
const commonBackgroundStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #D16BA5, #86A8E7, #5FFBF1)',
};

function ServerLogs() {
  const { serverId } = useParams(); // URL'den sunucu ID'sini al
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Logları getirme
  useEffect(() => {
    fetchLogs();
  }, [serverId]);

  const fetchLogs = async () => {
    try {
      const response = await api.get(`http://127.0.0.1:8080/api/v1/logs/${serverId}`);
      setLogs(response.data);
    } catch (error) {
      console.error('Loglar alınırken hata oluştu:', error);
      showNotification('Loglar alınırken hata oluştu.', 'error');
    }
  };

  // Bildirimleri gösterme
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Bildirim kapatma
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Filtrelenen loglar
  const filteredLogs = (logs || []).filter((log) =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <Box sx={commonBackgroundStyle}>
        <Container component="main" maxWidth="lg">
          <Typography
              variant="h4"
              align="center"
              sx={{
                marginBottom: '20px',
                color: '#6A1B9A',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 'bold',
              }}
          >
            Server Logs
          </Typography>

          <TextField
              label="Search Logs"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ marginBottom: '20px', backgroundColor: '#ffffff' }}
          />

          <Grid container spacing={3}>
            {filteredLogs.map((log, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Log Type: {log.logTypeId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Timestamp: {log.timestamp}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Message: {log.message}
                    </Typography>
                  </Paper>
                </Grid>
            ))}
          </Grid>

          {/* Bildirim Alanı */}
          <Snackbar
              open={notification.open}
              autoHideDuration={4000}
              onClose={handleNotificationClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
                onClose={handleNotificationClose}
                severity={notification.severity}
                sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
  );
}

export default ServerLogs;
