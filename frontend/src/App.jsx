import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'; // 1. Nhớ import useLocation
import Header from './components/Header'; 
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import authUtils from './utils/auth';

// Import các trang
import Home from './pages/Home';
import ManagementPage from './pages/ManagementPage';
import MenuMagement from './pages/MenuManagement';
import ServiceManagement from './pages/ServiceManagement';
import InvoiceManagement from './pages/InvoiceManagement';
import Stats from './pages/Stats';
import RolesPage from './pages/RolesPage';
import ManagerBooking from './pages/ManagerBooking';
import Login from './pages/login';

// --- TẠO COMPONENT CON ĐỂ XỬ LÝ LOGIC UI ---
// Component này nằm TRONG BrowserRouter nên dùng được useLocation
const AppContent = () => {
  const location = useLocation(); 
  const isLoginPage = location.pathname === '/';
  const isAuthenticated = authUtils.isAuthenticated();

  // Nếu đã đăng nhập và đang ở trang login, redirect đến home
  if (isLoginPage && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="app-wrapper">
        
        {/* Chỉ hiện Header nếu KHÔNG PHẢI trang login */}
        {!isLoginPage && <Header />}
        
        <div className="main-content">
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
             <Route path="/management" element={<ProtectedRoute><ManagementPage /></ProtectedRoute>} />
             <Route path="/menu-management" element={<ProtectedRoute><MenuMagement /></ProtectedRoute>} />
             <Route path="/service-management" element={<ProtectedRoute><ServiceManagement /></ProtectedRoute>} />
              <Route path="/invoice-management" element={<ProtectedRoute><InvoiceManagement /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><ManagerBooking /></ProtectedRoute>} />
              <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
              <Route path="/roles" element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />
           </Routes>
        </div>

        {/* Thường thì Footer cũng nên ẩn ở trang Login giống Header */}
        <Footer />
        
    </div>
  );
};

// --- COMPONENT CHÍNH ---
function App() {
  return (
    // BrowserRouter phải bao bọc bên ngoài cùng
    <BrowserRouter>
       <AppContent />
    </BrowserRouter>
  );
}

export default App;