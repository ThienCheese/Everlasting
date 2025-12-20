import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaApple, FaGooglePlay, FaHeart } from 'react-icons/fa';
import logoImg from '../assets/weblogo.png'; // Thay bằng logo màu trắng của bạn nếu có

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* --- PHẦN TRÊN: LINK & LOGO --- */}
        <div className="footer-top">
          
          {/* Logo & Brand */}
          <div className="footer-brand">
            <div className="brand-logo">
               {/* Nếu không có logo trắng, dùng text */}
               <h2 className="brand-text">Everlasting</h2>
            </div>
            <p className="made-with">
              made with <FaHeart className="heart-icon" />
            </p>
          </div>

          {/* Cột Link 1 */}
          <div className="footer-col">
            <h4>Dịch vụ & Cảm hứng</h4>
            <ul>
              <li><a href="#">Trang trí tiệc cưới</a></li>
              <li><a href="#">Thực đơn & Bàn tiệc</a></li>
              <li><a href="#">Âm thanh & Ánh sáng</a></li>
              <li><a href="#">Chụp ảnh phóng sự</a></li>
              <li><a href="#">Lập kế hoạch đám cưới</a></li>
            </ul>
          </div>

          {/* Cột Link 2 */}
          <div className="footer-col">
            <h4>Về Chúng tôi</h4>
            <ul>
              <li><a href="#">Giới thiệu chung</a></li>
              <li><a href="#">Đội ngũ nhân sự</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Đối tác & Nhà cung cấp</a></li>
              <li><a href="#">Liên hệ báo chí</a></li>
            </ul>
          </div>

          {/* Cột Link 3 */}
          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Cột 4: App & Vendor (QR Code) */}
          <div className="footer-col promo-col">
            <h4>Tải ứng dụng miễn phí</h4>
            <div className="app-promo">
              <div className="qr-code">
                {/* Thay src bằng link ảnh QR của bạn hoặc để trống */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=EverlastingApp" alt="QR Code" />
              </div>
              <div className="store-btns">
                <button className="store-btn">
                  <FaApple size={20} />
                  <span>Download on the<br/><strong>App Store</strong></span>
                </button>
                <button className="store-btn">
                  <FaGooglePlay size={18} />
                  <span>Get it on<br/><strong>Google Play</strong></span>
                </button>
              </div>
            </div>
            <div className="vendor-link">
              <p>Bạn là nhà cung cấp?</p>
              <a href="#">Đăng ký hợp tác ngay &rarr;</a>
            </div>
          </div>
        </div>

        {/* --- PHẦN DƯỚI: COPYRIGHT & SOCIAL --- */}
        <div className="footer-bottom">
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Accessibility</a>
            <span>&copy; 2025 Everlasting Wedding.</span>
          </div>
          
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Pinterest"><FaPinterestP /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;