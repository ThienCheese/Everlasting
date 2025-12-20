import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvoiceManagement.css';
import { 
    FaSearch, FaFileInvoiceDollar, FaEye, FaDownload, 
    FaCalendarAlt, FaClock, FaMapMarkerAlt, 
    FaUtensils, FaCameraRetro, FaUserFriends // Đã đổi FaHeart -> FaUserFriends
} from "react-icons/fa";

const InvoiceManagement = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const navigate = useNavigate();

  // Dữ liệu mẫu (Không cần trường image nữa)
  const invoices = [
    {
      id: "WED-2510-A", 
      couple: "Tuấn Hưng & Minh Thư", 
      event: "Lễ Thành Hôn (Grand Ballroom)",
      location: "Sảnh Ngọc Trai - Tầng 2",
      date: "25/10/2025",
      time: "17:30 - 21:30",
      menuPrice: "250.000.000", 
      servicePrice: "45.000.000", 
      total: "295.000.000",
      status: "Đã thanh toán"
    },
    {
      id: "WED-2810-B", 
      couple: "Quốc Anh & Bảo Ngọc", 
      event: "Tiệc Cưới Ngoài Trời (Garden)",
      location: "Khu vườn Mùa Xuân",
      date: "28/10/2025", 
      time: "16:00 - 20:00",
      menuPrice: "180.000.000",
      servicePrice: "60.000.000", 
      total: "240.000.000",
      status: "Chờ thanh toán"
    },
    {
      id: "WED-1511-C", 
      couple: "Hải Đăng & Thuý Vi", 
      event: "Lễ Vu Quy (Thân mật)",
      location: "Sảnh Ruby - Tầng 1",
      date: "15/11/2025", 
      time: "11:00 - 14:00",
      menuPrice: "85.000.000",
      servicePrice: "15.000.000",
      total: "100.000.000",
      status: "Quá hạn"
    },
    {
      id: "WED-0212-D", 
      couple: "David Nguyen & Jessica", 
      event: "Lễ Báo Hỷ (Private Party)",
      location: "Rooftop Moonlight",
      date: "02/12/2025", 
      time: "18:00 - 23:00",
      menuPrice: "120.000.000",
      servicePrice: "30.000.000",
      total: "150.000.000",
      status: "Đã thanh toán"
    },
  ];

  const filteredInvoices = activeTab === 'Tất cả' 
    ? invoices 
    : invoices.filter(inv => inv.status === activeTab);

  const getStatusClass = (status) => {
    switch(status) {
        case "Đã thanh toán": return "status-paid";
        case "Chờ thanh toán": return "status-pending";
        case "Quá hạn": return "status-overdue";
        default: return "";
    }
  };

  return (
    <div className="invoice-page-wrapper">
      <div className="content-body">
        
        {/* HERO BANNER */}
        <div className="hero-banner invoice-banner-bg">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-text">
                    <h2 className="hero-title">Hóa đơn Tiệc Cưới</h2>
                    <p className="hero-subtitle">"Quản lý chi phí cho ngày trọng đại của các cặp đôi."</p>
                </div>
                <div className="hero-controls">
                    <div className="search-box glass-effect">
                        <input type="text" placeholder="Tìm tên CD-CR, mã HĐ..." />
                        <FaSearch className="search-icon" />
                    </div>
                    <button className="add-btn glass-btn" onClick={() => navigate('/booking')}>
                        <FaFileInvoiceDollar /> Lập hóa đơn mới
                    </button>
                </div>
            </div>
        </div>

        {/* TABS */}
        <div className="knot-tabs-container">
            {['Tất cả', 'Đã thanh toán', 'Chờ thanh toán', 'Quá hạn'].map(tab => (
                <div 
                    key={tab}
                    className={`knot-tab-item ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </div>
            ))}
        </div>

        {/* GRID LIST (Đã chỉnh sửa UI) */}
        <div className="invoice-grid">
            {filteredInvoices.map(inv => (
                <div key={inv.id} className="invoice-card">
                    {/* Header Card Mới: Đơn giản hơn, chỉ chứa ID và Status */}
                    <div className="inv-card-header-simple">
                        <div className="inv-id-text">#{inv.id}</div>
                        <div className={`inv-status-badge-simple ${getStatusClass(inv.status)}`}>
                            {inv.status}
                        </div>
                    </div>
                    
                    <div className="inv-card-body">
                        {/* Tên Sự kiện & Cặp đôi */}
                        <div className="inv-main-info">
                            <h3 className="inv-event-name">{inv.event}</h3>
                            <div className="inv-couple-row">
                                <FaUserFriends className="icon-couple"/> {inv.couple}
                            </div>
                        </div>

                        <hr className="divider-dashed"/>

                        {/* Thời gian & Địa điểm */}
                        <div className="inv-meta-grid">
                            <div className="meta-item">
                                <FaCalendarAlt className="icon-meta"/> <span>{inv.date}</span>
                            </div>
                            <div className="meta-item">
                                <FaClock className="icon-meta"/> <span>{inv.time}</span>
                            </div>
                            <div className="meta-item full-width">
                                <FaMapMarkerAlt className="icon-meta"/> <span>{inv.location}</span>
                            </div>
                        </div>

                        {/* CHI TIẾT TIỀN */}
                        <div className="inv-price-breakdown">
                            <div className="price-row">
                                <span className="price-label"><FaUtensils/> Thực đơn tiệc:</span>
                                <span className="price-val">{inv.menuPrice}</span>
                            </div>
                            <div className="price-row">
                                <span className="price-label"><FaCameraRetro/> Trang trí & DV:</span>
                                <span className="price-val">{inv.servicePrice}</span>
                            </div>
                            <div className="price-total-row">
                                <span>Tổng thanh toán:</span>
                                <span className="total-val">{inv.total} đ</span>
                            </div>
                        </div>
                    </div>

                    <div className="inv-card-footer">
                        <button className="inv-action-btn view">
                            <FaEye /> Xem HĐ
                        </button>
                        <button className="inv-action-btn download">
                            <FaDownload /> Tải PDF
                        </button>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default InvoiceManagement;