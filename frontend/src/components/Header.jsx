import React, { useState, useEffect, useRef } from 'react'; // 1. Import thêm useRef
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/weblogo.png'; 
import './Header.css'; 
// Import các icon cần thiết cho User Menu
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import authUtils from '../utils/auth';
import apiService from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  
  // State cuộn trang
  const [isScrolled, setIsScrolled] = useState(false);
  
  // --- MỚI: State quản lý User Menu ---
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Lấy thông tin user từ localStorage
  const user = authUtils.getUser() || {
    name: "Guest",
    role: "Khách"
  };

  // Map role ID sang tên role
  const getRoleName = (maNhom) => {
    const roleMap = {
      1: "Admin",
      2: "Lễ tân",
      3: "Quản lý",
      4: "Bếp trưởng",
      5: "Kế toán",
      6: "Guest"
    };
    return roleMap[maNhom] || "Khách";
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Hàm đóng menu khi click ra ngoài
    const handleClickOutside = (event) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
            setShowUserMenu(false);
        }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
      try {
        const refreshToken = authUtils.getRefreshToken();
        
        // Call API logout
        if (refreshToken) {
          await apiService.logout(refreshToken);
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Xóa auth data và redirect
        authUtils.clearAuth();
        navigate('/');
      }
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      
      {/* 1. LOGO BÊN TRÁI (Giữ nguyên font viết tay) */}
      <div className="nav-left" onClick={() => navigate('/home')}>
        {/* <img src={logoImg} alt="Logo" className="nav-logo-img" /> */}
        <span className="brand-name">Ever<span className="brand-bold">lasting</span></span>
      </div>

      {/* 2. MENU Ở GIỮA (Giữ nguyên style viên thuốc) */}
      <div className="nav-center">
        <ul className="nav-links">
          <li className="nav-link-item" onClick={() => navigate('/home')}>Trang Chủ</li>
          
          {/* --- DROPDOWN QUẢN LÝ --- */}
          <li className="nav-link-item dropdown-parent">
            <div className="dropdown-label">
                Quản lý <span className="arrow">▼</span>
            </div>
            <ul className="dropdown-menu">
                <div className="dropdown-bridge"></div>
                <li><span className="dropdown-item" onClick={() => navigate('/management')}>Quản lý sảnh</span></li>
                <li><span className="dropdown-item" onClick={() => navigate('/menu-management')}>Quản lý thực đơn</span></li>
                <li><span className="dropdown-item" onClick={() => navigate('/service-management')}>Quản lý dịch vụ</span></li>
                <li><span className="dropdown-item" onClick={() => navigate('/invoice-management')}>Quản lý hóa đơn</span></li>
            </ul>
          </li>

          <li className="nav-link-item" onClick={() => navigate('/booking')}>Đặt tiệc</li>
          <li className="nav-link-item" onClick={() => navigate('/stats')}>Thống kê</li>
          <li className="nav-link-item" onClick={() => navigate('/roles')}>Phân quyền</li>
        </ul>
      </div>

      {/* 3. BÊN PHẢI: USER ACCOUNT (THAY THẾ NÚT LOGOUT CŨ) */}
      <div className="nav-right" ref={userMenuRef}>
        
        {/* Nút hiển thị tài khoản (Giống hình mẫu) */}
        <div 
            className={`user-account-btn ${showUserMenu ? 'active' : ''}`} 
            onClick={() => setShowUserMenu(!showUserMenu)}
        >
            <div className="user-avatar-circle">
                {/* Chữ cái đầu tên User */}
                {/* <span className="avatar-text">E</span> */}
            </div>
            <span className="user-name-text">Your account <span className="arrow">▼</span></span>
        </div>

        {/* Menu con thả xuống của User */}
        {showUserMenu && (
            <div className="user-dropdown-menu">
                {/* Header nhỏ trong menu */}
                <div className="user-info-header">
                    <p className="u-name">{user.name || user.username}</p>
                    <p className="u-role">{getRoleName(user.maNhom)}</p>
                </div>
                <hr />
                <button className="user-menu-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="u-icon"/> Đăng xuất
                </button>
            </div>
        )}
      </div>

    </nav>
  );
};

export default Header;