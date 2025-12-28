import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './login.css';
import logoImg from '../assets/weblogo.png'; 
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import clickSound from '../assets/mouse-click.mp3';
import sunIcon from '../assets/dark_mode_light.webp';       
import speakerIcon from '../assets/sfx_on_light.webp';
import moonIcon from '../assets/dark_mode_dark.webp';
import speakerIcondarkmode from '../assets/sfx_on_dark.webp';
import speakerIconOff from '../assets/sfx_off_light.webp';
import speakerIcondarkmodeOff from '../assets/sfx_off_dark.webp';
import apiService from '../services/api';
import authUtils from '../utils/auth';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State cho form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State cho UI
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Check if redirected due to token expiration
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    
    // Validate input
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call API login
      console.log('[LOGIN] Calling API with:', { username });
      const response = await apiService.login(username, password);
      
      console.log('[LOGIN] Response received:', response);
      
      if (response.status === 'success') {
        // Lưu tokens và user info
        authUtils.setTokens(response.data.accessToken, response.data.refreshToken);
        authUtils.setUser(response.data.user);
        
        console.log('[LOGIN] Tokens saved. AccessToken:', response.data.accessToken ? 'YES' : 'NO');
        console.log('[LOGIN] User saved:', response.data.user);
        console.log('[LOGIN] isAuthenticated:', authUtils.isAuthenticated());
        
        // Redirect đến home
        console.log('[LOGIN] Navigating to /home...');
        navigate('/home');
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
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
            <img src={isDarkMode ? moonIcon : sunIcon} alt="Mode" className="custom-icon" />     
          </button>
          <button className="icon-btn" onClick={() => {toggleSound(); playClickSound();}} title="Bật/Tắt âm thanh">
            <img src={getSpeakerImage()} alt="Sound" className="custom-icon" />    
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Star removed per request */}

        <div className="login-box">
          <h2 className="login-title">SIGN IN</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Username" 
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="confirm-btn"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Confirm'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span style={{ color: isDarkMode ? '#fff' : '#666' }}>
              Chưa có tài khoản?{' '}
            </span>
            <button 
              onClick={() => navigate('/register')}
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
              Đăng ký ngay
            </button>
          </div>
        </div>
      </main>

      {/* <footer className="footer">
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
      </footer> */}
    </div>
  );
};

export default Login;