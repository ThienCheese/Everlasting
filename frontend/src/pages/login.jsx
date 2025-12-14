import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';
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
  const playStarSound = () => {
  const audio = new Audio(sparkleSound);
  audio.volume = 0.5;
  audio.play();
};



const Login = () => {
const navigate = useNavigate();
/* const handleLoginSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    
    // Logic kiểm tra user/pass ở đây...
    
    console.log("Chuyển trang...");
    navigate("/home"); 
  }; */
const playClickSound = () =>{
  const audio= new Audio(clickSound);
  audio.play();
};
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [isSoundOn, setIsSoundOn] = useState(true);
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
  return (
    <div className={`login-page ${isDarkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="logo-container">
          <img src={logoImg} alt="Everlasting Logo" className="logo-img" />
          <span className="brand-name">EVER<span className="brand-bold">LASTING</span></span>
        </div>
        <div className="header-actions">
            <button className="icon-btn" onClick={() => {toggleDarkMode(); playClickSound();}} title="Chế độ Sáng/Tối" >
                <img src={isDarkMode ? moonIcon : sunIcon} alt="Mode" className="custom-icon" />     
            </button>
            <button className="icon-btn" onClick={() => {toggleSound(); playClickSound();}} title="Bật/Tắt âm thanh" >
                <img src={getSpeakerImage()} alt="Sound" className="custom-icon" />    
            </button>

        </div>
      </header>

      <main className="main-content">
        <div className="star-container">
          <img src={starImg} alt="Star" className="star-icon" onMouseEnter={playStarSound}/>
        </div>

        <div className="login-box">
          <h2 className="login-title">SIGN IN</h2>
          <form className="login-form">
            <div className="input-group">
              <input type="text" placeholder="Username" className="input-field" />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" className="input-field" />
            </div>
            <button type="submit" className="confirm-btn" >Confirm</button>
          </form>
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

export default Login;