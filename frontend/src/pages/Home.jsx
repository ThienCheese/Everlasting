import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { GrPlan } from "react-icons/gr";
import { RiCameraAiFill } from "react-icons/ri";
import { GiMusicalScore } from "react-icons/gi";
import { FaGem } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import soundTing from '../assets/ting.mp3';
import sparkleImg1 from '../assets/bling1.png';
import sparkleImg2 from '../assets/bling2.png';
import sparkleImg3 from '../assets/bling3.png';
import Header from "../components/Header";
import apiService from '../services/api';

import './Home.css';
import logoImg from '../assets/weblogo.png';

const servicesData = [
  { id: 1, title: "Đặt Tiệc Cưới", desc: "Tổ chức tiệc cưới trọn gói sang trọng.", icon: <GrPlan />, color: "#FADADD" },
  { id: 2, title: "Quay Phim - Chụp Ảnh", desc: "Ghi lại trọn vẹn khoảnh khắc hạnh phúc.", icon: <RiCameraAiFill/>, color: "#C1F2D0" }, 
  { id: 3, title: "Ban Nhạc & MC", desc: "Dẫn chương trình và biểu diễn chuyên nghiệp.", icon: <IoIosPeople />, color: "#A2E3F1" }, 
  { id: 4, title: "Ẩm Thực", desc: "Thực đơn đa dạng, phong phú.", icon: <MdOutlineRestaurantMenu />, color: "#FFE599" }, 
  { id: 5, title: "Trang Trí", desc: "Concept trang trí độc đáo.", icon: <FaGem/>, color: "#857CD9" },
  { id: 6, title: "Âm Thanh & Ánh Sáng", desc: "Hệ thống âm thanh ánh sáng đỉnh cao.", icon: <GiMusicalScore />, color: "#FFC09F" }, 
];

const galleryData = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
];
const Home = () => {
    const playHoverSound = () => {
        const audio = new Audio(soundTing);
        audio.volume = 0.4; 
        audio.play();
    };
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate=useNavigate();
    
    // State cho dữ liệu từ API
    const [danhSachMonAn, setDanhSachMonAn] = useState([]);
    const [danhSachDichVu, setDanhSachDichVu] = useState([]);
    const [danhSachSanh, setDanhSachSanh] = useState([]);
    const [loading, setLoading] = useState(true);
    // Load dữ liệu từ API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [monAnRes, dichVuRes, sanhRes] = await Promise.all([
                    apiService.getAllMonAn(),
                    apiService.getAllDichVu(),
                    apiService.getSanh()
                ]);
                
                setDanhSachMonAn(monAnRes.data || []);
                setDanhSachDichVu(dichVuRes.data || []);
                setDanhSachSanh(sanhRes.data || []);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);
    
    //logic bat su kien cuon
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY>50);
        };
        window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll",handleScroll);
    },[]);
    const handleLogout = () => {
        navigate("/");
    }
    const [activeIndex, setActiveIndex] = useState(0);
    const galleryRef = useRef(null);

    const handleGalleryScroll = () => {
      if (galleryRef.current) {
        const container = galleryRef.current;
        const containerCenter = container.getBoundingClientRect().width / 2;
        
        const children = Array.from(container.children);
        let closestIndex = 0;
        let minDistance = Number.MAX_VALUE;
  
        children.forEach((child, index) => {
          const childBox = child.getBoundingClientRect();
          const childCenter = childBox.left + childBox.width / 2;
          // Tính khoảng cách tương đối từ tâm thẻ đến tâm container
          const distance = Math.abs(childCenter - (container.getBoundingClientRect().left + containerCenter));
  
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });
  
        setActiveIndex(closestIndex);
      }
    };
  
    useEffect(() => {
      handleGalleryScroll(); 
    }, []);
    const SCROLL_AMOUNT = 320; 

    const scrollLeft = () => {
        if (galleryRef.current) {
            galleryRef.current.scrollBy({
                left: -SCROLL_AMOUNT,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (galleryRef.current) {
            galleryRef.current.scrollBy({
                left: SCROLL_AMOUNT,
                behavior: 'smooth'
            });
        }
    };
    return(
        <div className="home-page">
            
            <section className="we-video-section">
                <div className="video-container">
                    {/* <iframe width="100%" height="100%" src="https://youtu.be/CdWb96Vw3Gc?si=4IrgKitDEpFsft_v" title="Wedding Intro" frameBorder="0" allow="accelerometer;autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe> */}
                    <iframe width="80%" height="100%" src="https://www.youtube.com/embed/P6bVB1hAgSA?si=sqopj6r4zvOCoMks" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    {/* <div className="video-overlay">
                        <h1>Chào mừng đến với Dịch vụ Tiệc cưới</h1>
                        <p>Nơi hạnh phúc thăng hoa</p>
                    </div> */}
                </div>
            </section>
            {/* Dịch vụ nổi bật */}
            <section className="services-section">
                <h2>Dịch vụ của chúng tôi</h2><br></br>
                <div className="services-grid">
                    {servicesData.map((item,index) => (
                        <div key={item.id} className={`service-card ${index === 4 ?'large-card':''}`} style={{backgroundColor:item.color}} onMouseEnter={playHoverSound}>
                            <div className="service-icon">{item.icon}</div>
                            <div className="service-content">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Gallery truoc ngang */}
            <section className="gallery-section">
                <img src={sparkleImg1} alt="sparkle" className="sparkle-decoration s-top-left" />
                <img src={sparkleImg2} alt="sparkle" className="sparkle-decoration s-center-right" />
                <img src={sparkleImg3} alt="sparkle" className="sparkle-decoration s-bottom-center" />
                <div className="gallery-header">
                    <h2>Hình ảnh nổi bật</h2>
                </div>
                
                {/* Thêm sự kiện onScroll */}
                <div 
                  className="gallery-scroll-container" 
                  ref={galleryRef} 
                  onScroll={handleGalleryScroll}
                >
                   {galleryData.map((imgUrl, index) => (
                     <div 
                       key={index} 
                       className={`gallery-card ${index === activeIndex ? "active" : ""}`}
                     >
                       <img src={imgUrl} alt={`Story ${index}`} />
                       <div className="gallery-overlay">
                         <h4>Album {index + 1}</h4>
                       </div>
                     </div>
                   ))}
                </div>
                
                {/* Chỉ báo (Dots) */}
                <div className="dots-container">
                    {galleryData.map((_, index) => (
                        <span key={index} className={`dot ${index === activeIndex ? "active" : ""}`}></span>
                    ))}
                </div>

                <div className="scroll-controls">
                    {/* Nút Trái (Prev) */}
                    <button className="scroll-btn prev" onClick={scrollLeft}>
                        <svg 
                            className="arrow-icon prev-icon" 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    {/* Nút Phải (Next) */}
                    <button className="scroll-btn next" onClick={scrollRight}>
                        <svg 
                            className="arrow-icon next-icon" 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </section>

            {/* Món ăn nổi bật */}
            <section className="dishes-section">
                <h2>Món ăn đặc sắc</h2>
                <p className="section-subtitle">Thực đơn phong phú với hơn {danhSachMonAn.length} món ăn</p>
                {loading ? (
                    <div className="loading-spinner">Đang tải...</div>
                ) : (
                    <div className="dishes-grid">
                        {danhSachMonAn.slice(0, 6).map((monAn) => (
                            <div key={monAn.MaMonAn} className="dish-card" onMouseEnter={playHoverSound}>
                                <div className="dish-image">
                                    {monAn.HinhAnh ? (
                                        <img src={monAn.HinhAnh} alt={monAn.TenMonAn} />
                                    ) : (
                                        <div className="dish-placeholder">
                                            <MdOutlineRestaurantMenu size={40} />
                                        </div>
                                    )}
                                </div>
                                <div className="dish-info">
                                    <h3>{monAn.TenMonAn}</h3>
                                    <p className="dish-category">{monAn.TenLoaiMonAn || 'Món ăn'}</p>
                                    <p className="dish-price">{new Intl.NumberFormat('vi-VN').format(monAn.DonGia)} đ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Sảnh tiệc */}
            <section className="halls-section">
                <h2>Sảnh tiệc sang trọng</h2>
                <p className="section-subtitle">{danhSachSanh.length} sảnh với sức chứa đa dạng</p>
                {loading ? (
                    <div className="loading-spinner">Đang tải...</div>
                ) : (
                    <div className="halls-grid">
                        {danhSachSanh.slice(0, 4).map((sanh) => (
                            <div key={sanh.MaSanh} className="hall-card" onMouseEnter={playHoverSound}>
                                <div className="hall-image">
                                    {sanh.HinhAnh ? (
                                        <img src={sanh.HinhAnh} alt={sanh.TenSanh} />
                                    ) : (
                                        <div className="hall-placeholder">
                                            <FaGem size={50} />
                                        </div>
                                    )}
                                </div>
                                <div className="hall-info">
                                    <h3>{sanh.TenSanh}</h3>
                                    <p className="hall-type">{sanh.TenLoaiSanh || 'Sảnh tiệc'}</p>
                                    <div className="hall-details">
                                        <span className="hall-capacity">Sức chứa: {sanh.SoLuongBanToiDa} bàn</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Dịch vụ bổ sung */}
            <section className="services-extra-section">
                <h2>Dịch vụ bổ sung</h2>
                <p className="section-subtitle">Hoàn thiện trọn vẹn ngày trọng đại của bạn</p>
                {loading ? (
                    <div className="loading-spinner">Đang tải...</div>
                ) : (
                    <div className="services-extra-grid">
                        {danhSachDichVu.slice(0, 8).map((dichVu) => (
                            <div key={dichVu.MaDichVu} className="service-extra-card" onMouseEnter={playHoverSound}>
                                <div className="service-extra-icon">
                                    <RiCameraAiFill size={30} />
                                </div>
                                <div className="service-extra-content">
                                    <h4>{dichVu.TenDichVu}</h4>
                                    <p className="service-extra-category">{dichVu.TenLoaiDichVu || 'Dịch vụ'}</p>
                                    <p className="service-extra-price">{new Intl.NumberFormat('vi-VN').format(dichVu.DonGia)} đ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
          
        </div>
    );
};
export default Home;