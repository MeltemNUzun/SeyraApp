import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Grid, Paper } from '@mui/material';

// Ortak arka plan stilini tanımlayın
const commonBackgroundStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #D16BA5, #86A8E7, #5FFBF1)',
};

function ServerLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const logs = [
    { logTypeId: 'Error', timestamp: '2024-10-30 14:32', message: 'Server failed to respond.' },
    { logTypeId: 'Warning', timestamp: '2024-10-30 15:45', message: 'High memory usage detected.' },
  ];

  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={commonBackgroundStyle}>
      <Container component="main" maxWidth="lg">
        <Typography variant="h4" align="center" sx={{ marginBottom: '20px', color: '#6A1B9A', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>
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
      </Container>
    </Box>
  );
}

export default ServerLogs;