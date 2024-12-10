import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Snackbar,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

function ServerLogs() {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [importance, setImportance] = useState('');
  const [logType, setLogType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Bildirim gösterme
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Backend'den logları alma
  const fetchLogs = async () => {
    try {
      const response = await api.get(`/logs/${serverId}`);
      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (error) {
      console.error('Loglar alınırken hata oluştu:', error);
      showNotification('Loglar alınırken hata oluştu.', 'error');
    }
  };

  // İlk yükleme
  useEffect(() => {
    if (serverId) {
      fetchLogs();
    }
  }, [serverId]);

  useEffect(() => {
    let filtered = logs;
  
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // Importance filter
    if (importance) {
      filtered = filtered.filter((log) => log.importance === importance);
    }
  
    // Log type filter
    if (logType) {
      filtered = filtered.filter((log) => log.log_type_id === parseInt(logType, 10));
    }
  
    // Date and time filter
    if (startDate && endDate) {
      const start = new Date(startDate).getTime(); // Start date as timestamp
      const end = new Date(endDate).getTime(); // End date as timestamp
  
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp).getTime(); // Log timestamp
        return logDate >= start && logDate <= end; // Compare timestamps
      });
    }
  
    setFilteredLogs(filtered);
  }, [logs, searchTerm, importance, logType, startDate, endDate]);
  

  // Bildirim kapatma
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.post('http://127.0.0.1:8080/api/v1/logout');
      showNotification('Başarıyla çıkış yapıldı', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      showNotification('Çıkış yapılamadı.', 'error');
    }
  };

  // DataGrid sütunları
  const columns = [
    { field: 'timestamp', headerName: 'Timestamp', flex: 1 },
    { field: 'logTypeName', headerName: 'Log Type', flex: 1 }, // Backend'deki tanıma göre düzenlendi
    { field: 'importance', headerName: 'Importance', flex: 1 },
    { field: 'message', headerName: 'Message', flex: 2 },
  ];

  return (
    <Container component="main" maxWidth="lg">
      {/* Logout Butonu */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '10px 0',
        }}
      >
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Başlık */}
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

      {/* Filtreler */}
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <TextField
          label="Search Logs"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="logType-label">Log Type</InputLabel>
          <Select
            labelId="logType-label"
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">INFO</MenuItem>
            <MenuItem value="2">WARN</MenuItem>
            <MenuItem value="3">ERROR</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="importance-label">Importance</InputLabel>
          <Select
            labelId="importance-label"
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="datetime-local"
          label="Start Date & Time"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
        />
        <TextField
          type="datetime-local"
          label="End Date & Time"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Log Listesi */}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredLogs}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.log_id || row.id || Math.random().toString(36).substr(2, 9)}
        />
      </Box>

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
  );
}

export default ServerLogs;
