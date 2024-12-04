import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from './pages/Login';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import ServerManagement from './pages/ServerManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout'; // Layout bileşenini import ettik
import ServerLogs from './pages/ServerLogs';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Sayfası (Sabit layout olmadan gösterilecek) */}
        <Route
          path="/"
          element={
            <>
              <Helmet>
                <title>SEYRA - Giriş Yap</title>
              </Helmet>
              <Login />
            </>
          }
        />

        {/* Layout kullanılarak sabit içerik ve sayfalar */}
        <Route element={<Layout />}>
          {/* Ana Sayfa */}
          <Route
            path="/home"
            element={
              <>
                <Helmet>
                  <title>SEYRA - Ana Sayfa</title>
                </Helmet>
                <Home />
              </>
            }
          />

          {/* Kullanıcı Yönetimi */}
          <Route
            path="/user-management"
            element={
              <>
                <Helmet>
                  <title>SEYRA - Kullanıcı Yönetimi</title>
                </Helmet>
                <UserManagement />
              </>
            }
          />

          {/* Sunucu Yönetimi */}
          <Route
            path="/server-management"
            element={
              <>
                <Helmet>
                  <title>SEYRA - Sunucu Yönetimi</title>
                </Helmet>
                <ServerManagement />
              </>
            }
          />

          {/* Şifremi Unuttum */}
          <Route
            path="/forgot-password"
            element={
              <>
                <Helmet>
                  <title>SEYRA - Şifremi Unuttum</title>
                </Helmet>
                <ForgotPassword />
              </>
            }
          />

          {/* Şifre Sıfırla */}
          <Route
            path="/reset-password/:token"
            element={
              <>
                <Helmet>
                  <title>SEYRA - Şifreyi Sıfırla</title>
                </Helmet>
                <ResetPassword />
              </>
            }
          />

          {/* Server Logs */}
          <Route
            path="/server-logs/:serverId"
            element={
              <>
                <Helmet>
                  <title>SEYRA - Sunucu Logları</title>
                </Helmet>
                <ServerLogs />
              </>
            }
          />
        </Route>

        {/* Bilinmeyen Rotaya Yönlendirme */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
