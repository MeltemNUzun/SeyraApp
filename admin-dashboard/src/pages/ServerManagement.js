import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DnsIcon from '@mui/icons-material/Dns';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const serverTypes = ['Web Servers', 'Mail Servers', 'Database Servers'];
const serverTypeIds = { 'Web Servers': 2, 'Mail Servers': 3, 'Database Servers': 4 };

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
  const [deleteDialog, setDeleteDialog] = useState({ open: false, serverId: null }); // Onay dialog state
  const navigate = useNavigate();

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
      fetchServers();
      setNewServer({ name: '', type: '', vendor: '', ip: '', username: '', password: '' });
      setIsAddingServer(false);
    } catch (error) {
      console.error('Sunucu eklenirken hata oluştu:', error);
      showNotification('Sunucu ekleme yetkiniz yok!', 'error');
    }
  };

  const handleDeleteServer = async (serverId) => {
    try {
      await api.delete(`http://127.0.0.1:8080/api/v1/delete-server/${serverId}`);
      showNotification('Sunucu başarıyla silindi', 'success');
      fetchServers();
    } catch (error) {
      console.error('Sunucu silinirken hata oluştu:', error);
      showNotification('Sunucu silmeye yetkiniz yok!', 'error');
    }
  };

  const handleDeleteClick = (serverId) => {
    setDeleteDialog({ open: true, serverId }); // Dialog açılır
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.serverId) {
      handleDeleteServer(deleteDialog.serverId);
    }
    setDeleteDialog({ open: false, serverId: null }); // Dialog kapatılır
  };

  const handleDialogClose = () => {
    setDeleteDialog({ open: false, serverId: null }); // Dialog kapatılır
  };

  const handleViewLogs = (serverId) => {
    navigate(`/server-logs/${serverId}`);
  };

  const handleAddServerClick = () => {
    setIsAddingServer(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewServer((prevState) => ({ ...prevState, [name]: value }));
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

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

  return (
    <Box sx={{ margin: 0, padding: 0, minHeight: '100vh', overflowY: 'auto', position: 'relative' }}>
      {/* Silme Onay Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDialogClose}>
        <DialogTitle>Sunucuyu Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu sunucuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Vazgeç
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sağ üst köşede sabitlenen Sunucu Ekle ve Çıkış Yap butonları */}
      <Box
        sx={{
          position: 'fixed',
          top: '160px',
          right: '25px',
          display: 'flex',
          gap: 2,
          zIndex: 1000,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleAddServerClick}>
          Sunucu Ekle
        </Button>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </Box>

      {/* Sabitlenen Server Management başlıkları */}
      <Box
        sx={{
          position: 'fixed',
          top: '160px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 1000,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#6A1B9A',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 'bold',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          <DnsIcon sx={{ fontSize: '30px', marginRight: '8px' }} />
          Server Management
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: '1rem',
            color: '#333',
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Manage servers, view details, and assign servers easily.
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ marginTop: '150px' }}>
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
          {servers &&
            servers.map((server) => (
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
                  onClick={() => handleDeleteClick(server.server_id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
            ))}
        </List>

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
