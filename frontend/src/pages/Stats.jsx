import React, { useState, useEffect } from 'react';
import './Stats.css';
import { 
    FaMoneyBillWave, FaCalendarCheck, FaUserFriends, FaChartLine, 
    FaArrowUp, FaArrowDown, FaFilter, FaCrown, FaSync, FaPlus
} from "react-icons/fa";
import apiService from '../services/api';

const Stats = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [viewMode, setViewMode] = useState('year'); // 'year' or 'month'
  
  const [baoCao, setBaoCao] = useState(null);
  const [danhSachHoaDon, setDanhSachHoaDon] = useState([]);
  const [danhSachDatTiec, setDanhSachDatTiec] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth, viewMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      if (viewMode === 'year') {
        // Load yearly report
        const baoCaoRes = await apiService.getBaoCaoByNam(selectedYear);
        setBaoCao(baoCaoRes.data);
        
        // Load all invoices and bookings for the year
        const [hoaDonRes, datTiecRes] = await Promise.all([
          apiService.getAllHoaDon(),
          apiService.getAllDatTiec()
        ]);
        
        // Filter by year
        const filteredHoaDon = (hoaDonRes.data || []).filter(hd => {
          const year = new Date(hd.NgayLapHoaDon).getFullYear();
          return year === selectedYear;
        });
        
        const filteredDatTiec = (datTiecRes.data || []).filter(dt => {
          const year = new Date(dt.NgayDaiTiec).getFullYear();
          return year === selectedYear;
        });
        
        setDanhSachHoaDon(filteredHoaDon);
        setDanhSachDatTiec(filteredDatTiec);
      } else {
        // Load monthly report
        try {
          const baoCaoRes = await apiService.getBaoCaoByThang(selectedMonth, selectedYear);
          setBaoCao(baoCaoRes.data);
        } catch (err) {
          // No report for this month yet
          setBaoCao(null);
        }
        
        // Load invoices and bookings for the month
        const [hoaDonRes, datTiecRes] = await Promise.all([
          apiService.getHoaDonByMonth(selectedMonth, selectedYear),
          apiService.getDatTiecByMonth(selectedMonth, selectedYear)
        ]);
        
        setDanhSachHoaDon(hoaDonRes.data || []);
        setDanhSachDatTiec(datTiecRes.data || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await apiService.createBaoCaoDoanhSo({
        thang: selectedMonth,
        nam: selectedYear
      });

      setSuccess('Tạo báo cáo thành công!');
      loadData();
    } catch (err) {
      setError(err.message || 'Tạo báo cáo thất bại');
    } finally {
      setLoading(false);
    }
  };

  // --- CALCULATIONS FROM DATABASE ---
  
  // Calculate overview stats
  const calculateStats = () => {
    const totalRevenue = danhSachHoaDon
      .filter(hd => hd.TrangThai === 1) // Only paid invoices
      .reduce((sum, hd) => sum + parseFloat(hd.TongTienHoaDon || 0), 0);
    
    const totalBookings = danhSachDatTiec.filter(dt => !dt.DaHuy).length;
    
    const totalGuests = danhSachDatTiec
      .filter(dt => !dt.DaHuy)
      .reduce((sum, dt) => sum + (dt.SoLuongBan * 10), 0);
    
    const depositedBookings = danhSachDatTiec.filter(dt => 
      !dt.DaHuy && parseFloat(dt.TienDatCoc || 0) > 0
    ).length;
    const depositRate = totalBookings > 0 
      ? Math.round((depositedBookings / totalBookings) * 100) 
      : 0;

    return {
      totalRevenue,
      totalBookings,
      totalGuests,
      depositRate
    };
  };

  const stats = calculateStats();

  // Generate monthly revenue data for chart
  const generateRevenueData = () => {
    if (viewMode === 'month' || !baoCao) {
      // For month view or no yearly report, show monthly breakdown
      const monthlyData = [];
      for (let month = 1; month <= 12; month++) {
        const monthHoaDon = danhSachHoaDon.filter(hd => {
          const hdDate = new Date(hd.NgayLapHoaDon);
          return hdDate.getMonth() + 1 === month && 
                 hdDate.getFullYear() === selectedYear &&
                 hd.TrangThai === 1;
        });
        
        const revenue = monthHoaDon.reduce((sum, hd) => 
          sum + parseFloat(hd.TongTienHoaDon || 0), 0
        );
        
        monthlyData.push({
          month: `T${month}`,
          value: revenue,
          label: formatCurrency(revenue / 1000000) + 'tr'
        });
      }
      
      // Normalize to percentage
      const maxRevenue = Math.max(...monthlyData.map(d => d.value), 1);
      return monthlyData.map(d => ({
        ...d,
        percentage: Math.round((d.value / maxRevenue) * 100)
      }));
    }
    
    // Use yearly report data if available
    return baoCao.map(bc => {
      const revenue = parseFloat(bc.TongDoanhThu || 0);
      const maxRevenue = Math.max(...baoCao.map(b => parseFloat(b.TongDoanhThu || 0)), 1);
      
      return {
        month: `T${bc.Thang}`,
        value: revenue,
        label: formatCurrency(revenue / 1000000) + 'tr',
        percentage: Math.round((revenue / maxRevenue) * 100)
      };
    });
  };

  // Calculate top halls
  const calculateTopHalls = () => {
    const hallStats = {};
    
    danhSachDatTiec.filter(dt => !dt.DaHuy).forEach(dt => {
      const hallName = dt.TenSanh || 'N/A';
      if (!hallStats[hallName]) {
        hallStats[hallName] = { bookings: 0, revenue: 0 };
      }
      hallStats[hallName].bookings++;
      
      // Find corresponding invoice
      const hoaDon = danhSachHoaDon.find(hd => 
        hd.MaDatTiec === dt.MaDatTiec && hd.TrangThai === 1
      );
      if (hoaDon) {
        hallStats[hallName].revenue += parseFloat(hoaDon.TongTienHoaDon || 0);
      }
    });
    
    // Convert to array and sort
    return Object.entries(hallStats)
      .map(([name, data]) => ({
        name,
        bookings: data.bookings,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5
  };

  const topHalls = calculateTopHalls();

  // Calculate booking statuses
  const calculateBookingStatuses = () => {
    const completed = danhSachDatTiec.filter(dt => {
      const eventDate = new Date(dt.NgayDaiTiec);
      return eventDate < new Date() && !dt.DaHuy;
    }).length;
    
    const pending = danhSachDatTiec.filter(dt => {
      const eventDate = new Date(dt.NgayDaiTiec);
      return eventDate >= new Date() && !dt.DaHuy;
    }).length;
    
    const cancelled = danhSachDatTiec.filter(dt => dt.DaHuy).length;
    
    return { completed, pending, cancelled };
  };

  const bookingStatuses = calculateBookingStatuses();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const revenueData = generateRevenueData();

  const statsCards = [
    { 
        id: 1, 
        title: "Tổng Doanh Thu", 
        value: formatCurrency(stats.totalRevenue) + ' đ', 
        icon: <FaMoneyBillWave />, 
        color: "purple" 
    },
    { 
        id: 2, 
        title: "Tiệc Đã Tổ Chức", 
        value: stats.totalBookings + " Tiệc", 
        icon: <FaCalendarCheck />, 
        color: "green" 
    },
    { 
        id: 3, 
        title: "Khách Tham Dự", 
        value: formatCurrency(stats.totalGuests), 
        icon: <FaUserFriends />, 
        color: "orange" 
    },
    { 
        id: 4, 
        title: "Tỉ Lệ Đặt Cọc", 
        value: stats.depositRate + "%", 
        icon: <FaChartLine />, 
        color: "blue" 
    },
  ];

  if (loading && !danhSachHoaDon.length) {
    return <div className="loading-stats">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="stats-page-wrapper">
      <div className="content-body">
        
        {error && <div className="alert alert-error" style={{margin: '20px', padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '8px'}}>{error}</div>}
        {success && <div className="alert alert-success" style={{margin: '20px', padding: '15px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px'}}>{success}</div>}
        
        {/* --- HEADER --- */}
        <div className="stats-header">
            <div className="header-text">
                <h1>Thống Kê & Báo Cáo</h1>
                <p>Tổng quan tình hình kinh doanh của Everlasting.</p>
            </div>
            
            {/* Bộ lọc thời gian */}
            <div className="stats-filter">
                <div className="filter-group">
                  <label>Năm:</label>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                    {[2023, 2024, 2025, 2026].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Tháng:</label>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                    {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>Tháng {month}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Chế độ:</label>
                  <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                    <option value="year">Cả năm</option>
                    <option value="month">Theo tháng</option>
                  </select>
                </div>

                <button className="refresh-btn" onClick={loadData} disabled={loading}>
                  <FaSync /> {loading ? 'Đang tải...' : 'Làm mới'}
                </button>

                {viewMode === 'month' && !baoCao && (
                  <button className="create-report-btn" onClick={handleCreateReport} disabled={loading}>
                    <FaPlus /> Tạo báo cáo
                  </button>
                )}
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
                    </div>
                </div>
            ))}
        </div>

        {/* --- 2. MAIN CHART & TOP HALLS (Chia 2 cột) --- */}
        <div className="stats-main-section">
            
            {/* Cột Trái: Biểu đồ doanh thu (CSS Only) */}
            <div className="chart-container">
                <div className="section-head">
                    <h3>Biểu đồ doanh thu {viewMode === 'year' ? `năm ${selectedYear}` : `tháng ${selectedMonth}/${selectedYear}`}</h3>
                </div>
                <div className="css-bar-chart">
                    {revenueData.map((item, index) => (
                        <div key={index} className="chart-col">
                            <div 
                                className="bar" 
                                style={{height: `${item.percentage || 0}%`}} 
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
                    {topHalls.length > 0 ? topHalls.map((hall, index) => {
                        const maxBookings = Math.max(...topHalls.map(h => h.bookings), 1);
                        const colors = ['#8A7CDF', '#FF8C00', '#2E7D32', '#E91E63', '#3F51B5'];
                        
                        return (
                          <div key={index} className="hall-stat-item">
                              <div className="hall-stat-info">
                                  <h4>{index + 1}. {hall.name}</h4>
                                  <div className="hall-progress-bg">
                                      <div 
                                          className="hall-progress-fill" 
                                          style={{
                                            width: `${(hall.bookings / maxBookings) * 100}%`, 
                                            backgroundColor: colors[index % colors.length]
                                          }}
                                      ></div>
                                  </div>
                              </div>
                              <div className="hall-stat-numbers">
                                  <span className="h-bookings">{hall.bookings} tiệc</span>
                                  <span className="h-revenue">{formatCurrency(hall.revenue / 1000000)}tr</span>
                              </div>
                          </div>
                        );
                    }) : (
                      <div className="empty-message">Chưa có dữ liệu</div>
                    )}
                </div>

                {/* Mini Card: Trạng thái đặt tiệc */}
                <div className="mini-stat-box">
                    <h4>Trạng thái Booking {viewMode === 'month' ? `tháng ${selectedMonth}` : `năm ${selectedYear}`}</h4>
                    <div className="status-grid">
                        <div className="status-item done">
                            <span className="dot"></span>
                            <span>Hoàn thành: <strong>{bookingStatuses.completed}</strong></span>
                        </div>
                        <div className="status-item pending">
                            <span className="dot"></span>
                            <span>Sắp tới: <strong>{bookingStatuses.pending}</strong></span>
                        </div>
                        <div className="status-item cancel">
                            <span className="dot"></span>
                            <span>Hủy: <strong>{bookingStatuses.cancelled}</strong></span>
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