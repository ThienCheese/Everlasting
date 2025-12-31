import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'; // 1. Nhớ import useLocation
import Header from './components/Header'; 
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import WithPermission from './components/WithPermission';
import AuthErrorHandler from './components/AuthErrorHandler';
import authUtils from './utils/auth';
import permissionService from './services/permissionService';
import { PERMISSIONS } from './utils/permissions';

// Import các trang
import Home from './pages/Home';
import ManagementPage from './pages/ManagementPage';
import MenuMagement from './pages/MenuManagement';
import ServiceManagement from './pages/ServiceManagement';
import InvoiceManagement from './pages/InvoiceManagement';
import Stats from './pages/Stats';
import RolesPage from './pages/RolesPage';
import ManagerBooking from './pages/ManagerBooking';
import Settings from './pages/Settings';
import Login from './pages/login';
import Register from './pages/Register';

// Loading component
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p style={{ color: '#666', fontSize: '16px' }}>Loading system...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

// --- TẠO COMPONENT CON ĐỂ XỬ LÝ LOGIC UI ---
// Component này nằm TRONG BrowserRouter nên dùng được useLocation
const AppContent = () => {
  const location = useLocation(); 
  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';
  const isAuthPage = isLoginPage || isRegisterPage;
  const isAuthenticated = authUtils.isAuthenticated();

  // Nếu đã đăng nhập và đang ở trang login/register, redirect đến home
  if (isAuthPage && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Lấy PERMISSIONS từ service
  const PERMISSIONS = permissionService.PERMISSIONS;

  return (
    <div className="app-wrapper">
        {/* Auth Error Handler - Listen for token expiration */}
        <AuthErrorHandler />
        
        {/* Chỉ hiện Header nếu KHÔNG PHẢI trang login hoặc register */}
        {!isAuthPage && <Header />}
        
        <div className={isAuthPage ? 'main-content main-auth' : 'main-content'}>
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/register" element={<Register />} />
             
             {/* Trang chủ - Tất cả user đã đăng nhập */}
             <Route 
               path="/home" 
               element={
                 <ProtectedRoute>
                   <Home />
                 </ProtectedRoute>
               } 
             />
             
             {/* Quản lý sảnh - Admin, Lễ tân, Quản lý */}
             <Route 
               path="/management" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={PERMISSIONS.QUAN_LY_SANH || 2}>
                     <ManagementPage />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
             
             {/* Quản lý thực đơn - Admin, Quản lý, Bếp trưởng */}
             <Route 
               path="/menu-management" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={PERMISSIONS.QUAN_LY_MON_AN || 3}>
                     <MenuMagement />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
             
             {/* Quản lý dịch vụ - Admin, Quản lý */}
             <Route 
               path="/service-management" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={PERMISSIONS.QUAN_LY_DICH_VU || 4}>
                     <ServiceManagement />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
             
             {/* Quản lý hóa đơn - MaChucNang = 6 (Admin, Kế toán) */}
             <Route 
               path="/invoice-management" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={PERMISSIONS.QUAN_LY_HOA_DON || 6}>
                     <InvoiceManagement />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
             
             {/* Đặt tiệc - Admin, Lễ tân, Bếp trưởng, Kế toán */}
             <Route 
               path="/booking" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={PERMISSIONS.QUAN_LY_DAT_TIEC || 5}>
                     <ManagerBooking />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
             
             {/* Thống kê - Admin (1) và Kế toán (6) */}
             <Route 
               path="/stats" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={[PERMISSIONS.QUAN_LY_NGUOI_DUNG || 1, PERMISSIONS.QUAN_LY_HOA_DON || 6]}>
                     <Stats />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
             
             {/* Phân quyền - Chỉ Admin */}
             <Route 
               path="/roles" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={PERMISSIONS.QUAN_LY_NGUOI_DUNG || 1}>
                     <RolesPage />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
             
             {/* Cài đặt tham số - Chỉ Admin */}
             <Route 
               path="/settings" 
               element={
                 <ProtectedRoute>
                   <WithPermission requiredPermissions={PERMISSIONS.QUAN_LY_NGUOI_DUNG || 1}>
                     <Settings />
                   </WithPermission>
                 </ProtectedRoute>
               } 
             />
           </Routes>
        </div>

        {/* Thường thì Footer cũng nên ẩn ở trang Login giống Header */}
        <Footer />
        
    </div>
  );
};

// --- COMPONENT CHÍNH ---
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing app...');
        await permissionService.initialize();
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Failed to load application</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    // BrowserRouter phải bao bọc bên ngoài cùng
    <BrowserRouter>
       <AppContent />
    </BrowserRouter>
  );
}

export default App;