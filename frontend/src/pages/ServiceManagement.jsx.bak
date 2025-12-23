import React, { useState } from 'react';
import './ServiceManagement.css'; 
import { FaSearch, FaPlus, FaHeart, FaStar, FaFilter, FaChevronDown, FaCheck } from "react-icons/fa";

const ServiceManagement = () => {
  // Dữ liệu mẫu (Cập nhật ảnh dạng dọc/portrait)
  const services = [
    {
      id: 1,
      name: "Luxury Wedding Decor",
      brand: "Royal Touch Decor",
      category: "Trang trí",
      price: "15.000.000 đ",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 5,
    },
    {
      id: 2,
      name: "Acoustic Live Band",
      brand: "Melody Soul",
      category: "Âm nhạc",
      price: "5.000.000 đ",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Cinematic Wedding Film",
      brand: "Lens Master Studio",
      category: "Quay chụp",
      price: "8.500.000 đ",
      image: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Vintage Mustang",
      brand: "Classic Wheels",
      category: "Xe hoa",
      price: "4.000.000 đ",
      image: "https://images.unsplash.com/photo-1550523179-c5c798033285?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 5,
    },
    {
      id: 5,
      name: "Floral Aisle Runner",
      brand: "Bloom Garden",
      category: "Trang trí",
      price: "2.500.000 đ",
      image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
    },
    {
      id: 6,
      name: "MC Professional",
      brand: "Voice of Love",
      category: "Âm nhạc",
      price: "3.000.000 đ",
      image: "https://images.unsplash.com/photo-1511578314322-379afb445a4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
    },
  ];

  // State giả lập checkbox category
  const categories = ["Trang trí", "Âm nhạc", "Quay chụp", "Xe hoa", "Ẩm thực"];
  const [selectedCats, setSelectedCats] = useState([]);

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
        setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
        setSelectedCats([...selectedCats, cat]);
    }
  };

  return (
    <div className="service-page-wrapper">
      <div className="content-body">
        
        {/* --- HERO BANNER (Giữ nguyên style cũ) --- */}
        <div className="hero-banner">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-text">
                    <h2 className="hero-title">Dịch vụ & Tiện ích</h2>
                    <p className="hero-subtitle">"Nâng tầm trải nghiệm tiệc cưới với các dịch vụ đẳng cấp."</p>
                </div>
                <div className="hero-controls">
                    <div className="search-box glass-effect">
                        <input type="text" placeholder="Tìm kiếm dịch vụ..." />
                        <FaSearch className="search-icon" />
                    </div>
                    <button className="add-btn glass-btn">
                        <FaPlus /> Thêm mới
                    </button>
                </div>
            </div>
        </div>

        {/* --- MAIN LAYOUT (2 CỘT) --- */}
        <div className="main-layout">
            
            {/* CỘT TRÁI: SIDEBAR FILTER */}
            <aside className="filter-sidebar">
                <div className="sidebar-header">
                    <h3>Bộ lọc (Filters)</h3>
                    <button className="btn-clear">Xóa tất cả</button>
                </div>

                {/* Nhóm lọc 1: Danh mục */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Danh mục</span>
                        <FaChevronDown className="icon-chevron"/>
                    </div>
                    <div className="filter-options">
                        {categories.map(cat => (
                            <label key={cat} className="custom-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCats.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                <span className="checkmark"><FaCheck className="icon-check"/></span>
                                <span className="label-text">{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Nhóm lọc 2: Khoảng giá */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Khoảng giá</span>
                        <FaChevronDown className="icon-chevron"/>
                    </div>
                    <div className="price-inputs">
                        <input type="text" placeholder="Thấp nhất" />
                        <span>-</span>
                        <input type="text" placeholder="Cao nhất" />
                    </div>
                </div>

                {/* Nút Áp dụng */}
                <button className="btn-apply-filter">Áp dụng bộ lọc</button>
            </aside>

            {/* CỘT PHẢI: GRID DỊCH VỤ */}
            <main className="service-content">
                <div className="content-header-bar">
                    <span className="result-count">Hiển thị {services.length} kết quả</span>
                    <select className="sort-dropdown">
                        <option>Mới nhất</option>
                        <option>Giá: Thấp đến Cao</option>
                        <option>Giá: Cao đến Thấp</option>
                    </select>
                </div>

                <div className="knot-style-grid">
                    {services.map(service => (
                        <div key={service.id} className="knot-card">
                            <div className="card-img-wrapper">
                                <img src={service.image} alt={service.name} />
                                <button className="btn-heart">
                                    <FaHeart />
                                </button>
                                {/* Tag giá nằm gọn gàng trên ảnh */}
                                <div className="price-badge">{service.price}</div>
                            </div>
                            
                            <div className="card-details">
                                <div className="brand-label">{service.brand}</div>
                                <h3 className="service-title">{service.name}</h3>
                                <div className="rating-row">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < Math.floor(service.rating) ? "star filled" : "star"} />
                                        ))}
                                    </div>
                                    <span className="rating-num">({service.rating})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;