import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; // 1. Nhớ import useLocation
import Header from './components/Header'; 
import Footer from './components/Footer';

// Import các trang
import Home from './pages/Home';
import ManagementPage from './pages/ManagementPage';
import MenuMagement from './pages/MenuManagement';
import ServiceManagement from './pages/ServiceManagement';
import InvoiceManagement from './pages/InvoiceManagement';
import Stats from './pages/Stats';
import RolesPage from './pages/RolesPage';
import ManagerBooking from './pages/ManagerBooking';
import Login from './pages/Login';

// --- TẠO COMPONENT CON ĐỂ XỬ LÝ LOGIC UI ---
// Component này nằm TRONG BrowserRouter nên dùng được useLocation
const AppContent = () => {
  const location = useLocation(); 
  const isLoginPage = location.pathname === '/';

  return (
    <div className="app-wrapper">
        
        {/* Chỉ hiện Header nếu KHÔNG PHẢI trang login */}
        {!isLoginPage && <Header />}
        
        <div className="main-content">
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/home" element={<Home />} />
             <Route path="/management" element={<ManagementPage />} />
             <Route path="/menu-management" element={<MenuMagement />} />
             <Route path="/service-management" element={<ServiceManagement />} />
              <Route path="/invoice-management" element={<InvoiceManagement />} />
              <Route path="/booking" element={<ManagerBooking />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/roles" element={<RolesPage />} />
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