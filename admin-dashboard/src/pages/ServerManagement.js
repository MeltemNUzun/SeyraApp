import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

// Ortak arka plan stili
const commonBackgroundStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #D16BA5, #86A8E7, #5FFBF1)',
};

const serverTypes = ['Web Servers', 'Mail Servers', 'Database Servers'];
const serverTypeIds = { 'Web Servers': 2, 'Mail Servers': 3, 'Database Servers': 4 };

// Vendor seçenekleri
const vendorOptions = {
  'Web Servers': ['Apache', 'Nginx', 'IIS'],
  'Mail Servers': ['Postfix', 'Exim', 'Microsoft Exchange'],
  'Database Servers': ['MySQL', 'PostgreSQL', 'Oracle'],
};

function ServerManagement() {
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [servers, setServers] = useState([]);
  const [newServer, setNewServer] = useState({
    name: '',
    type: '',
    vendor: '',
    ip: '',
    username: '',
    password: '',
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate(); // Sayfa yönlendirmesi için

  // Sunucuları getirme
  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8080/api/v1/servers');
      setServers(response.data);
    } catch (error) {
      console.error('Sunucuları getirirken hata oluştu:', error);
      showNotification('Sunucuları getirirken hata oluştu.', 'error');
    }
  };

  // Sunucu ekleme
  const handleSaveServer = async () => {
    try {
      await api.post('http://127.0.0.1:8080/api/v1/add-server', {
        server_name: newServer.name,
        server_type_id: serverTypeIds[newServer.type] || 4,
        ip_address: newServer.ip,
        vendor: newServer.vendor,
        server_username: newServer.username,
        server_password: newServer.password,
      });
      showNotification('Sunucu başarıyla eklendi', 'success');
      fetchServers(); // Sunucu listesini güncelle
      setNewServer({ name: '', type: '', vendor: '', ip: '', username: '', password: '' });
      setIsAddingServer(false);
    } catch (error) {
      console.error('Sunucu eklenirken hata oluştu:', error);
      showNotification('Sunucu ekleme yetkiniz yok!', 'error');
    }
  };

  // Sunucu silme
  const handleDeleteServer = async (serverId) => {
    try {
      await api.delete(`http://127.0.0.1:8080/api/v1/delete-server/${serverId}`);
      showNotification('Sunucu başarıyla silindi', 'success');
      fetchServers(); // Sunucu listesini güncelle
    } catch (error) {
      console.error('Sunucu silinirken hata oluştu:', error);
      showNotification('Sunucu silmeye yetkiniz yok!', 'error');
    }
  };

  // Logları görüntüleme
  const handleViewLogs = (serverId) => {
    navigate(`/server-logs/${serverId}`); // Sunucu loglarına yönlendirme
  };

  // Sunucu ekleme butonu yönetimi
  const handleAddServerClick = () => {
    setIsAddingServer(true);
  };

  // Giriş alanı değişikliklerini yönetme
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewServer((prevState) => ({ ...prevState, [name]: value }));
  };

  // Bildirimleri gösterme
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Bildirim kapatma
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Çıkış yapma
  const handleLogout = async () => {
    try {
      await api.post('http://127.0.0.1:8080/api/v1/logout');
      showNotification('Başarıyla çıkış yapıldı', 'success');
      navigate('/login'); // Login sayfasına yönlendir
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      showNotification('Çıkış yapılamadı.', 'error');
    }
  };

  return (
    <Box sx={commonBackgroundStyle}>
      <Container component="main" maxWidth="md">
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
          Sunucu Yönetimi
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddServerClick}
          sx={{ marginBottom: '20px' }}
        >
          Sunucu Ekle
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ marginBottom: '20px', marginLeft: '10px' }}
        >
          Çıkış Yap
        </Button>

        {isAddingServer && (
          <Card
            className="mt-4"
            sx={{ padding: '20px', borderRadius: '10px', marginBottom: '20px' }}
          >
            <CardBody>
              <CardTitle tag="h5">Yeni Sunucu Ekle</CardTitle>
              <TextField
                label="Sunucu Adı"
                name="name"
                variant="outlined"
                fullWidth
                value={newServer.name}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <Select
                label="Sunucu Tipi"
                name="type"
                variant="outlined"
                fullWidth
                value={newServer.type}
                onChange={(e) =>
                  handleInputChange({ target: { name: 'type', value: e.target.value } })
                }
                sx={{ marginBottom: '20px', backgroundColor: '#ffffff' }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Sunucu Tipi Seçin
                </MenuItem>
                {serverTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>

              {newServer.type && (
                <Select
                  label="Vendor"
                  name="vendor"
                  variant="outlined"
                  fullWidth
                  value={newServer.vendor}
                  onChange={(e) =>
                    handleInputChange({ target: { name: 'vendor', value: e.target.value } })
                  }
                  sx={{ marginBottom: '20px', backgroundColor: '#ffffff' }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Vendor Seçin
                  </MenuItem>
                  {vendorOptions[newServer.type]?.map((vendor) => (
                    <MenuItem key={vendor} value={vendor}>
                      {vendor}
                    </MenuItem>
                  ))}
                </Select>
              )}

              <TextField
                label="IP Adresi"
                name="ip"
                variant="outlined"
                fullWidth
                value={newServer.ip}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                label="Kullanıcı Adı"
                name="username"
                variant="outlined"
                fullWidth
                value={newServer.username}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                label="Şifre"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                value={newServer.password}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <Button variant="contained" color="success" onClick={handleSaveServer}>
                Kaydet
              </Button>
            </CardBody>
          </Card>
        )}

        <List>
        {servers && servers.map((server) => (

            <ListItem
              key={server.server_id}
              sx={{
                marginBottom: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <ListItemText
                primary={`${server.server_name} (Tip ID: ${server.server_type_id})`}
                secondary={`IP Adresi: ${server.ip_address}`}
                />
              <IconButton edge="end" aria-label="view" onClick={() => handleViewLogs(server.server_id)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteServer(server.server_id)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </ListItem>
          ))}
        </List>

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

export default ServerManagement;