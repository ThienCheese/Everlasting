import React, { useState } from 'react';
import './Stats.css';
import { 
    FaMoneyBillWave, FaCalendarCheck, FaUserFriends, FaChartLine, 
    FaArrowUp, FaArrowDown, FaFilter, FaCrown 
} from "react-icons/fa";

const Stats = () => {
  const [timeRange, setTimeRange] = useState('Tháng này');

  // --- DỮ LIỆU MẪU (MOCK DATA) ---
  
  // 1. Số liệu tổng quan
  const statsCards = [
    { 
        id: 1, 
        title: "Tổng Doanh Thu", 
        value: "2.850.000.000 đ", 
        change: "+12.5%", 
        isIncrease: true, 
        icon: <FaMoneyBillWave />, 
        color: "purple" 
    },
    { 
        id: 2, 
        title: "Tiệc Đã Tổ Chức", 
        value: "42 Tiệc", 
        change: "+8.2%", 
        isIncrease: true, 
        icon: <FaCalendarCheck />, 
        color: "green" 
    },
    { 
        id: 3, 
        title: "Khách Tham Dự", 
        value: "12,500", 
        change: "-2.1%", 
        isIncrease: false, 
        icon: <FaUserFriends />, 
        color: "orange" 
    },
    { 
        id: 4, 
        title: "Tỉ Lệ Đặt Cọc", 
        value: "95%", 
        change: "+5.4%", 
        isIncrease: true, 
        icon: <FaChartLine />, 
        color: "blue" 
    },
  ];

  // 2. Dữ liệu biểu đồ doanh thu (CSS Bar Chart)
  const revenueData = [
    { month: "T1", value: 40, label: "400tr" },
    { month: "T2", value: 55, label: "550tr" },
    { month: "T3", value: 35, label: "350tr" },
    { month: "T4", value: 70, label: "700tr" },
    { month: "T5", value: 60, label: "600tr" },
    { month: "T6", value: 90, label: "900tr" }, // Cao điểm
    { month: "T7", value: 80, label: "800tr" },
    { month: "T8", value: 45, label: "450tr" },
    { month: "T9", value: 65, label: "650tr" },
    { month: "T10", value: 100, label: "1 tỷ" }, // Cao nhất
    { month: "T11", value: 85, label: "850tr" },
    { month: "T12", value: 95, label: "950tr" },
  ];

  // 3. Top Sảnh được yêu thích
  const topHalls = [
    { name: "Sảnh Ngọc Uyên Ương", bookings: 120, revenue: "1.2 Tỷ", color: "#8A7CDF" },
    { name: "Thiên Duyên Garden", bookings: 95, revenue: "950 Tr", color: "#FF8C00" },
    { name: "Sảnh Đại Yến VIP", bookings: 60, revenue: "1.8 Tỷ", color: "#2E7D32" },
  ];

  return (
    <div className="stats-page-wrapper">
      <div className="content-body">
        
        {/* --- HEADER --- */}
        <div className="stats-header">
            <div className="header-text">
                <h1>Thống Kê & Báo Cáo</h1>
                <p>Tổng quan tình hình kinh doanh của Everlasting.</p>
            </div>
            
            {/* Bộ lọc thời gian */}
            <div className="stats-filter">
                <span className="filter-label">Thời gian:</span>
                <div className="filter-dropdown">
                    <button className="filter-btn">
                        {timeRange} <FaFilter className="icon-filter"/>
                    </button>
                    <div className="filter-menu">
                        {['Tuần này', 'Tháng này', 'Năm nay'].map(item => (
                            <div key={item} className="filter-item" onClick={() => setTimeRange(item)}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* --- 1. OVERVIEW CARDS (4 thẻ trên cùng) --- */ }
        <div className="stats-overview-grid">
            {statsCards.map(card => (
                <div key={card.id} className="stat-card">
                    <div className={`stat-icon-box ${card.color}`}>
                        {card.icon}
                    </div>
                    <div className="stat-info">
                        <h3 className="stat-value">{card.value}</h3>
                        <p className="stat-title">{card.title}</p>
                        <span className={`stat-change ${card.isIncrease ? 'up' : 'down'}`}>
                            {card.isIncrease ? <FaArrowUp/> : <FaArrowDown/>} {card.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>

        {/* --- 2. MAIN CHART & TOP HALLS (Chia 2 cột) --- */}
        <div className="stats-main-section">
            
            {/* Cột Trái: Biểu đồ doanh thu (CSS Only) */}
            <div className="chart-container">
                <div className="section-head">
                    <h3>Biểu đồ doanh thu năm 2025</h3>
                </div>
                <div className="css-bar-chart">
                    {revenueData.map((item, index) => (
                        <div key={index} className="chart-col">
                            <div 
                                className="bar" 
                                style={{height: `${item.value}%`}} 
                                data-label={item.label}
                            ></div>
                            <span className="month-label">{item.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cột Phải: Top Sảnh */}
            <div className="top-halls-container">
                <div className="section-head">
                    <h3><FaCrown style={{color: '#FFD700'}}/> Sảnh Tiệc Phổ Biến</h3>
                </div>
                <div className="halls-list">
                    {topHalls.map((hall, index) => (
                        <div key={index} className="hall-stat-item">
                            <div className="hall-stat-info">
                                <h4>{index + 1}. {hall.name}</h4>
                                <div className="hall-progress-bg">
                                    <div 
                                        className="hall-progress-fill" 
                                        style={{width: `${(hall.bookings / 150) * 100}%`, backgroundColor: hall.color}}
                                    ></div>
                                </div>
                            </div>
                            <div className="hall-stat-numbers">
                                <span className="h-bookings">{hall.bookings} tiệc</span>
                                <span className="h-revenue">{hall.revenue}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mini Card: Trạng thái đặt tiệc */}
                <div className="mini-stat-box">
                    <h4>Trạng thái Booking tháng này</h4>
                    <div className="status-grid">
                        <div className="status-item done">
                            <span className="dot"></span>
                            <span>Hoàn thành: <strong>12</strong></span>
                        </div>
                        <div className="status-item pending">
                            <span className="dot"></span>
                            <span>Chờ duyệt: <strong>5</strong></span>
                        </div>
                        <div className="status-item cancel">
                            <span className="dot"></span>
                            <span>Hủy: <strong>1</strong></span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Stats;