import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from './pages/Login';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import ServerManagement from './pages/ServerManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Layout from './components/Layout';
import ServerLogs from './pages/ServerLogs';
import DashboardPage from "./pages/DashboardPage"; // Dashboard Sayfası
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router> {/* Sadece BİR Router olacak */}
      <Routes>
        {/* Login Sayfası (Layout olmadan) */}
        <Route
          path="/"
          element={
            <>
             <HelmetProvider>
                <title>SEYRA - Giriş Yap</title>
              </HelmetProvider>
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
                <HelmetProvider>
                  <title>SEYRA - Ana Sayfa</title>
                </HelmetProvider>
                <Home />
              </>
            }
          />

          {/* Kullanıcı Yönetimi */}
          <Route
            path="/user-management"
            element={
              <>
                <HelmetProvider>
                  <title>SEYRA - Kullanıcı Yönetimi</title>
                </HelmetProvider>
                <UserManagement />
              </>
            }
          />

          {/* Sunucu Yönetimi */}
          <Route
            path="/server-management"
            element={
              <>
                <HelmetProvider>
                  <title>SEYRA - Sunucu Yönetimi</title>
                </HelmetProvider>
                <ServerManagement />
              </>
            }
          />

          {/* Şifremi Unuttum */}
          <Route
            path="/forgot-password"
            element={
              <>
               <HelmetProvider>
                  <title>SEYRA - Şifremi Unuttum</title>
                </HelmetProvider>
                <ForgotPassword />
              </>
            }
          />

          {/* Şifre Sıfırla */}
          <Route
            path="/reset-password/:token"
            element={
              <>
                <HelmetProvider>
                  <title>SEYRA - Şifreyi Sıfırla</title>
                </HelmetProvider>
                <ResetPassword />
              </>
            }
          />

          {/* Şifre Değiştir */}
          <Route
            path="/change-password"
            element={
              <>
                <HelmetProvider>
                  <title>SEYRA - Şifre Değiştir</title>
                </HelmetProvider>
                <ChangePassword />
              </>
            }
          />

          {/* Server Logs */}
          <Route
            path="/server-logs/:serverId"
            element={
              <>
               <HelmetProvider>
                  <title>SEYRA - Sunucu Logları</title>
                </HelmetProvider>
                <ServerLogs />
              </>
            }
          />

          {/* Dashboard Sayfası */}
          <Route
            path="/dashboard/:serverId"
            element={
              <>
               <HelmetProvider>
                  <title>SEYRA - Dashboard</title>
                </HelmetProvider>
                <DashboardPage />
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
