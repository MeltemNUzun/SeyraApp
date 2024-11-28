import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText, IconButton, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';

import { Card, CardBody, CardTitle } from 'reactstrap';
import api from "../axiosConfig";

// Ortak arka plan stilini tanımlayın
const commonBackgroundStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #D16BA5, #86A8E7, #5FFBF1)',
};

const roles = ["Admin", "Web Admin", "Mail Admin", "Database Admin"];
const roleIds = { "Admin": 1, "Web Admin": 2, "Mail Admin": 3, "Database Admin": 4 };

// Rol ID'sini kullanarak rol adını döndüren fonksiyon
const getRoleNameById = (roleId) => {
  return Object.keys(roleIds).find(key => roleIds[key] === roleId) || "Unknown Role";
};

function UserManagement() {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ firstName: '', email: '', password: '', role: '' });
  const [newRole, setNewRole] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Kullanıcıları getirme
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8080/api/v1/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error("Kullanıcıları getirirken hata oluştu:", error);
      showNotification("Kullanıcıları getirirken hata oluştu.", "error");
    }
  };

  // Kullanıcı ekleme
  const handleSaveUser = async () => {
    try {
      await api.post('http://127.0.0.1:8080/api/v1/register', {
        username: newUser.firstName,
        password: newUser.password,
        email: newUser.email,
        role_id: roleIds[newUser.role] || 4
      });
      showNotification("User registered successfully", "success");
      fetchUsers();
      setNewUser({ firstName: '', email: '', password: '', role: '' });
      setIsAddingUser(false);
    } catch (error) {
      console.error("Kullanıcı kaydedilirken hata oluştu:", error);
      showNotification("Kullanıcı kaydetme yetkiniz yok!", "error");
    }
  };

  // Kullanıcı rolü güncelleme
  const handleAddRoleToUser = async (userId) => {
    try {
      await api.put('http://127.0.0.1:8080/api/v1/update-user-role', {
        user_id: userId,
        role_id: roleIds[newRole[userId]] || 4
      });
      showNotification("User updated successfully", "success");
      fetchUsers();
      setNewRole(prevState => ({ ...prevState, [userId]: '' }));
    } catch (error) {
      console.error("Kullanıcı rolü güncellenirken hata oluştu:", error);
      showNotification("Kullanıcı rolü güncellenemedi.", "error");
    }
  };

  // Çıkış işlemi
  const handleLogout = async () => {
    try {
      await api.post('http://127.0.0.1:8080/api/v1/logout');
      showNotification("Logout successful", "success");
      window.location.href = '/login';
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      showNotification("Çıkış yapılamadı.", "error");
    }
  };

  const handleAddUserClick = () => {
    setIsAddingUser(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRoleInputChange = (value, userId) => {
    setNewRole(prevState => ({ ...prevState, [userId]: value }));
  };

  // Kullanıcı silme işlevi
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`http://127.0.0.1:8080/api/v1/delete-user/${userId}`);
      showNotification('User deleted successfully', "success");
      fetchUsers(); // Kullanıcı listesini güncelle
    } catch (error) {
      console.error('Kullanıcı silinirken hata oluştu:', error);
      showNotification('Kullanıcı silme yetkiniz yok.', "error");
    }
  };

  // Bildirimleri gösterme fonksiyonu
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Bildirim kapatma işlemi
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={commonBackgroundStyle}>
      <Container component="main" maxWidth="md">
        {/* SEYRA Başlık ve Logo */}
    <Box
      sx={{
        display: 'flex', // Elemanları yan yana düzenler
        flexDirection: 'column', // Alt alta sıralamak için
        alignItems: 'center', // Yatayda ortalar
        justifyContent: 'center', // Dikeyde ortalar
        marginTop: '-220px', // Üst boşluk
        marginBottom: '100px', // Alt boşluk
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/seyra-logo.png`}
        alt="Seyra Logo"
        style={{
          width: '100px', // Logonun boyutu
          height: '100px',
          borderRadius: '50%', // Oval görünüm
          marginBottom: '16px', // Logo ile yazı arasında boşluk
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        }}
      />
      <Typography
        component="h1"
        variant="h3"
        sx={{
          fontWeight: 'bold',
          fontSize: '2.5rem',
          color: '#ffffff',
          fontFamily: "'Poppins', sans-serif",
          textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
          textAlign: 'center', // Yazıyı ortalar
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
          textAlign: 'center', // Yazıyı ortalar
          marginTop: '8px', // Üst boşluk
        }}
      >
        Sunucu Yönetim Sistemi
      </Typography>
    </Box>
            {/* User Management Başlık ve Alt Başlık */}
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Typography
            variant="h4"
            sx={{
              color: '#6A1B9A',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            <PeopleIcon sx={{ fontSize: '30px', marginRight: '8px' }} />
            User Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '1rem',
              color: '#333',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Manage users, view details, and assign roles easily.
          </Typography>
        </Box>

        <Button variant="contained" color="primary" onClick={handleAddUserClick} sx={{ marginBottom: '20px' }}>
          Add User
        </Button>
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ marginBottom: '20px', marginLeft: '10px' }}>
          Logout
        </Button>

        {isAddingUser && (
          <Card className="mt-4" sx={{ padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <CardBody>
              <CardTitle tag="h5">Add New User</CardTitle>
              <TextField
                label="Username"
                name="firstName"
                variant="outlined"
                fullWidth
                value={newUser.firstName}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                value={newUser.email}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <TextField
                label="Password"
                name="password"
                variant="outlined"
                fullWidth
                value={newUser.password}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
              />
              <Select
                label="Role"
                name="role"
                variant="outlined"
                fullWidth
                value={newUser.role}
                onChange={(e) => handleInputChange({ target: { name: 'role', value: e.target.value } })}
                sx={{ marginBottom: '20px', backgroundColor: '#ffffff' }}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
              <Button variant="contained" color="success" onClick={handleSaveUser}>
                Save
              </Button>
            </CardBody>
          </Card>
        )}

        <List>
          {users.map(user => (
            <ListItem key={user.user_id} sx={{ marginBottom: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
              <ListItemText
                primary={`${user.username}`}
                secondary={`Role: ${getRoleNameById(user.role_id)}`}
              />
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.user_id)}>
                <DeleteIcon color="error" />
              </IconButton>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Select
                  value={newRole[user.user_id] || ''}
                  onChange={(e) => handleRoleInputChange(e.target.value, user.user_id)}
                  displayEmpty
                  sx={{ marginRight: '10px', width: '150px', backgroundColor: '#ffffff' }}
                >
                  <MenuItem value="" disabled>Select Role</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddRoleToUser(user.user_id)}
                >
                  Update Role
                </Button>
              </div>
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
          <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default UserManagement;