import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import ServerManagement from './pages/ServerManagement';
import ForgotPassword from './pages/ForgotPassword';  // ForgotPassword bileşenini içe aktardık
import 'bootstrap/dist/css/bootstrap.min.css';
import ServerLogs from './pages/ServerLogs';  // ServerLogs bileşenini içe aktardık



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/server-management" element={<ServerManagement />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />  {/* Şifremi Unuttum rotası */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/server-logs/:serverId" element={<ServerLogs />} />  {/* Yeni ServerLogs rotası */}
      </Routes>
    </Router>
  );
}

export default App;
