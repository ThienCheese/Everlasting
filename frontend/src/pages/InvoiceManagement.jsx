import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InvoiceManagement.css';
import { 
    FaSearch, FaFileInvoiceDollar, FaEye, FaDownload, 
    FaCalendarAlt, FaClock, FaMapMarkerAlt, 
    FaUtensils, FaCameraRetro, FaUserFriends, FaEdit, FaTimes
} from "react-icons/fa";
import apiService from '../services/api';

const InvoiceManagement = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [danhSachDatTiec, setDanhSachDatTiec] = useState([]);
  const [danhSachHoaDon, setDanhSachHoaDon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDatTiec, setSelectedDatTiec] = useState(null);
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);
  const [paymentData, setPaymentData] = useState({
    ngayThanhToan: new Date().toISOString().split('T')[0],
    apDungQuyDinhPhat: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [datTiecRes, hoaDonRes] = await Promise.all([
        apiService.getAllDatTiec(),
        apiService.getAllHoaDon()
      ]);

      setDanhSachDatTiec(datTiecRes.data || []);
      setDanhSachHoaDon(hoaDonRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (trangThai) => {
    switch(trangThai) {
      case 0: return "Chờ thanh toán";
      case 1: return "Đã thanh toán";
      case 2: return "Quá hạn";
      default: return "Không xác định";
    }
  };

  const getStatusClass = (trangThai) => {
    switch(trangThai) {
      case 1: return "status-paid";
      case 0: return "status-pending";
      case 2: return "status-overdue";
      default: return "";
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (tenCa) => {
    // Assuming tenCa might contain time info, or you could map it
    return tenCa || '';
  };

  const handleCreateInvoice = async () => {
    if (!selectedDatTiec) {
      alert('Vui lòng chọn đặt tiệc');
      return;
    }

    try {
      const hoaDonData = {
        maDatTiec: selectedDatTiec.MaDatTiec,
        ngayThanhToan: paymentData.ngayThanhToan,
        apDungQuyDinhPhat: paymentData.apDungQuyDinhPhat
      };

      await apiService.createHoaDon(hoaDonData);
      alert('Tạo hóa đơn thành công!');
      setShowCreateModal(false);
      setSelectedDatTiec(null);
      setPaymentData({
        ngayThanhToan: new Date().toISOString().split('T')[0],
        apDungQuyDinhPhat: false
      });
      loadData();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Lỗi khi tạo hóa đơn: ' + error.message);
    }
  };

  const handleUpdateStatus = async (trangThai) => {
    if (!selectedHoaDon) return;

    try {
      await apiService.updateTrangThaiHoaDon(selectedHoaDon.MaHoaDon, trangThai);
      alert('Cập nhật trạng thái thành công!');
      setShowUpdateModal(false);
      setSelectedHoaDon(null);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
  };

  const filteredInvoices = activeTab === 'Tất cả' 
    ? danhSachHoaDon 
    : danhSachHoaDon.filter(inv => getStatusLabel(inv.TrangThai) === activeTab);

  const searchedInvoices = filteredInvoices.filter(inv => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      inv.MaHoaDon?.toString().includes(search) ||
      inv.TenChuRe?.toLowerCase().includes(search) ||
      inv.TenCoDau?.toLowerCase().includes(search)
    );
  });

  // Filter dat tiec that don't have invoices yet
  const datTiecWithoutInvoice = danhSachDatTiec.filter(dt => {
    return !danhSachHoaDon.some(hd => hd.MaDatTiec === dt.MaDatTiec) && !dt.DaHuy;
  });

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
                        <input 
                          type="text" 
                          placeholder="Tìm tên CD-CR, mã HĐ..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="search-icon" />
                    </div>
                    <button className="add-btn glass-btn" onClick={() => setShowCreateModal(true)}>
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

        {/* GRID LIST */}
        <div className="invoice-grid">
            {loading ? (
              <div className="loading-message">Đang tải dữ liệu...</div>
            ) : searchedInvoices.length === 0 ? (
              <div className="empty-message">Không tìm thấy hóa đơn nào</div>
            ) : (
              searchedInvoices.map(inv => (
                <div key={inv.MaHoaDon} className="invoice-card">
                    <div className="inv-card-header-simple">
                        <div className="inv-id-text">#{inv.MaHoaDon}</div>
                        <div className={`inv-status-badge-simple ${getStatusClass(inv.TrangThai)}`}>
                            {getStatusLabel(inv.TrangThai)}
                        </div>
                    </div>
                    
                    <div className="inv-card-body">
                        <div className="inv-main-info">
                            <h3 className="inv-event-name">Tiệc Cưới - {inv.TenSanh}</h3>
                            <div className="inv-couple-row">
                                <FaUserFriends className="icon-couple"/> {inv.TenChuRe} & {inv.TenCoDau}
                            </div>
                        </div>

                        <hr className="divider-dashed"/>

                        <div className="inv-meta-grid">
                            <div className="meta-item">
                                <FaCalendarAlt className="icon-meta"/> <span>{formatDate(inv.NgayDaiTiec)}</span>
                            </div>
                            <div className="meta-item">
                                <FaClock className="icon-meta"/> <span>TT: {formatDate(inv.NgayThanhToan)}</span>
                            </div>
                            <div className="meta-item full-width">
                                <FaMapMarkerAlt className="icon-meta"/> <span>{inv.TenSanh}</span>
                            </div>
                        </div>

                        <hr className="divider-dashed"/>

                        <div className="inv-price-breakdown">
                            <div className="price-row">
                                <span className="price-label"><FaUtensils/> Tiền bàn:</span>
                                <span className="price-val">{formatCurrency(inv.TongTienBan)} đ</span>
                            </div>
                            <div className="price-row">
                                <span className="price-label"><FaCameraRetro/> Dịch vụ:</span>
                                <span className="price-val">{formatCurrency(inv.TongTienDichVu)} đ</span>
                            </div>
                            {inv.TongTienPhat > 0 && (
                              <div className="price-row penalty">
                                <span className="price-label">Tiền phạt:</span>
                                <span className="price-val">{formatCurrency(inv.TongTienPhat)} đ</span>
                              </div>
                            )}
                            <div className="price-total-row">
                                <span>Tổng hóa đơn:</span>
                                <span className="total-val">{formatCurrency(inv.TongTienHoaDon)} đ</span>
                            </div>
                            <div className="price-row remaining">
                                <span className="price-label">Còn lại:</span>
                                <span className="price-val">{formatCurrency(inv.TongTienConLai)} đ</span>
                            </div>
                        </div>
                    </div>

                    <div className="inv-card-footer">
                        <button className="inv-action-btn view" onClick={() => {
                          setSelectedHoaDon(inv);
                          setShowUpdateModal(true);
                        }}>
                            <FaEdit /> Cập nhật
                        </button>
                        <button className="inv-action-btn download">
                            <FaDownload /> Tải PDF
                        </button>
                    </div>
                </div>
              ))
            )}
        </div>

        {/* CREATE INVOICE MODAL */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content-invoice" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Lập hóa đơn mới</h2>
                <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Chọn đặt tiệc:</label>
                  <select 
                    value={selectedDatTiec?.MaDatTiec || ''} 
                    onChange={(e) => {
                      const dt = datTiecWithoutInvoice.find(d => d.MaDatTiec === parseInt(e.target.value));
                      setSelectedDatTiec(dt);
                    }}
                  >
                    <option value="">-- Chọn đặt tiệc --</option>
                    {datTiecWithoutInvoice.map(dt => (
                      <option key={dt.MaDatTiec} value={dt.MaDatTiec}>
                        #{dt.MaDatTiec} - {dt.TenChuRe} & {dt.TenCoDau} - {formatDate(dt.NgayDaiTiec)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ngày thanh toán:</label>
                  <input 
                    type="date" 
                    value={paymentData.ngayThanhToan}
                    onChange={(e) => setPaymentData({...paymentData, ngayThanhToan: e.target.value})}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={paymentData.apDungQuyDinhPhat}
                      onChange={(e) => setPaymentData({...paymentData, apDungQuyDinhPhat: e.target.checked})}
                    />
                    Áp dụng quy định phạt (nếu thanh toán trễ)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button className="btn-confirm" onClick={handleCreateInvoice}>Tạo hóa đơn</button>
              </div>
            </div>
          </div>
        )}

        {/* UPDATE STATUS MODAL */}
        {showUpdateModal && selectedHoaDon && (
          <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
            <div className="modal-content-invoice" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Cập nhật trạng thái hóa đơn #{selectedHoaDon.MaHoaDon}</h2>
                <button className="close-btn" onClick={() => setShowUpdateModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="invoice-detail">
                  <p><strong>Cặp đôi:</strong> {selectedHoaDon.TenChuRe} & {selectedHoaDon.TenCoDau}</p>
                  <p><strong>Ngày tiệc:</strong> {formatDate(selectedHoaDon.NgayDaiTiec)}</p>
                  <p><strong>Tổng tiền:</strong> {formatCurrency(selectedHoaDon.TongTienHoaDon)} đ</p>
                  <p><strong>Còn lại:</strong> {formatCurrency(selectedHoaDon.TongTienConLai)} đ</p>
                  <p><strong>Trạng thái hiện tại:</strong> {getStatusLabel(selectedHoaDon.TrangThai)}</p>
                </div>

                <div className="status-actions">
                  <h3>Cập nhật trạng thái:</h3>
                  <div className="status-buttons">
                    <button 
                      className="status-btn pending" 
                      onClick={() => handleUpdateStatus(0)}
                      disabled={selectedHoaDon.TrangThai === 0}
                    >
                      Chờ thanh toán
                    </button>
                    <button 
                      className="status-btn paid" 
                      onClick={() => handleUpdateStatus(1)}
                      disabled={selectedHoaDon.TrangThai === 1}
                    >
                      Đã thanh toán
                    </button>
                    <button 
                      className="status-btn overdue" 
                      onClick={() => handleUpdateStatus(2)}
                      disabled={selectedHoaDon.TrangThai === 2}
                    >
                      Quá hạn
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowUpdateModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InvoiceManagement;