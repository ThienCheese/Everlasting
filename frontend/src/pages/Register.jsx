import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css'; // Sử dụng chung CSS với login
import logoImg from '../assets/weblogo.png'; 
import starImg from '../assets/star-img.png'; 
import sparkleSound from '../assets/bell-notification.mp3';
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import clickSound from '../assets/mouse-click.mp3';
import sunIcon from '../assets/dark_mode_light.webp';       
import speakerIcon from '../assets/sfx_on_light.webp';
import moonIcon from '../assets/dark_mode_dark.webp';
import speakerIcondarkmode from '../assets/sfx_on_dark.webp';
import speakerIconOff from '../assets/sfx_off_light.webp';
import speakerIcondarkmodeOff from '../assets/sfx_off_dark.webp';
import apiService from '../services/api';

const playStarSound = () => {
  const audio = new Audio(sparkleSound);
  audio.volume = 0.5;
  audio.play();
};

const Register = () => {
  const navigate = useNavigate();

  // State cho form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State cho UI
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Sound functions
  const playClickSound = () => {
    if (isSoundOn) {
      const audio = new Audio(clickSound);
      audio.play();
    }
  };

  // Toggle functions
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode'); 
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  const getSpeakerImage = () => {
    if (isDarkMode) {
      return isSoundOn ? speakerIcondarkmode : speakerIcondarkmodeOff;
    } else {
      return isSoundOn ? speakerIcon : speakerIconOff;
    }
  };

  const getModeImage = () => {
    return isDarkMode ? moonIcon : sunIcon;
  };

  // Handle register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    
    // Reset messages
    setError('');
    setSuccess('');

    // Validate input
    if (!username.trim() || !password.trim() || !confirmPassword.trim() || !fullName.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Validate username length
    if (username.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    setLoading(true);

    try {
      // Call API register
      console.log('[REGISTER] Calling API with:', { username, fullName });
      const response = await apiService.register(username, password, fullName);
      
      console.log('[REGISTER] Response received:', response);
      
      if (response.success) {
        setSuccess('Đăng ký thành công! Tài khoản của bạn có quyền Guest. Vui lòng liên hệ Admin để nâng cấp quyền.');
        
        // Clear form
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        
        // Redirect về login sau 3 giây
        setTimeout(() => {
          console.log('[REGISTER] Redirecting to login...');
          navigate('/');
        }, 3000);
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('[REGISTER] Error:', err);
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${isDarkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="logo-container">
          <img src={logoImg} alt="Everlasting Logo" className="logo-img" />
          <span className="brand-name">EVER<span className="brand-bold">LASTING</span></span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => {toggleDarkMode(); playClickSound();}} title="Chế độ Sáng/Tối">
            <img src={getModeImage()} alt="Mode" className="custom-icon" />     
          </button>
          <button className="icon-btn" onClick={() => {toggleSound(); playClickSound();}} title="Bật/Tắt âm thanh">
            <img src={getSpeakerImage()} alt="Sound" className="custom-icon" />    
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="star-container">
          <img src={starImg} alt="Star" className="star-icon" onMouseEnter={playStarSound}/>
        </div>

        <div className="login-box">
          <h2 className="login-title">SIGN UP</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form className="login-form" onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Tên đăng nhập (ít nhất 3 ký tự)" 
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Họ và tên" 
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Mật khẩu (ít nhất 6 ký tự)" 
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Xác nhận mật khẩu" 
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="confirm-btn"
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: isDarkMode ? '#fff' : '#666' }}>
              Đã có tài khoản?{' '}
            </span>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#8A7CDF',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px',
                padding: '0',
              }}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-left">
          <span className="footer-logo"></span>
        </div>
        <div className="footer-right">
          <span className="copyright-text">© Copyrighted by Group05</span>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" onClick={playClickSound}>
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" onClick={playClickSound}>
              <FaInstagram />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
