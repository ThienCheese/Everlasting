import React, { useState, useEffect } from 'react';
import './InvoiceManagement.css';
import { 
    FaSearch, FaFileInvoiceDollar, FaDownload, 
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
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDatTiec, setSelectedDatTiec] = useState(null);
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);
  
  // Form data
  const [paymentData, setPaymentData] = useState({
    ngayThanhToan: new Date().toISOString().split('T')[0],
    apDungQuyDinhPhat: false
  });

  // State lưu chi tiết (Món ăn, Dịch vụ, Thông tin tiệc)
  const [bookingDetails, setBookingDetails] = useState({
    monAn: [],
    dichVu: [],
    thongTinTiec: null,
    loading: false
  });

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

  // --- HELPERS ---
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
    if (value === undefined || value === null || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // --- HANDLERS ---

  // Mở modal cập nhật và lấy chi tiết
  const handleOpenDetailModal = async (hoaDon) => {
    setSelectedHoaDon(hoaDon);
    setShowUpdateModal(true);
    setBookingDetails({ monAn: [], dichVu: [], thongTinTiec: null, loading: true });

    try {
      // 1. Lấy thông tin đặt tiệc gốc
      const tiecRes = await apiService.getDatTiecById(hoaDon.MaDatTiec);
      const tiecData = tiecRes.data;

      // 2. Lấy dịch vụ đã đặt
      const dichVuRes = await apiService.getDichVuDatTiec(hoaDon.MaDatTiec);
      
      // 3. Lấy món ăn (Dựa vào MaThucDon trong đặt tiệc)
      let monAnData = [];
      if (tiecData.MaThucDon) {
        // Lưu ý: Đảm bảo api.js đã có hàm getMonAnByThucDonId
        try {
            const monAnRes = await apiService.getMonAnByThucDonId(tiecData.MaThucDon);
            monAnData = monAnRes.data;
        } catch (err) {
            console.warn("Không thể tải món ăn, có thể do chưa cập nhật api.js", err);
        }
      }

      setBookingDetails({
        monAn: monAnData || [],
        dichVu: dichVuRes.data || [],
        thongTinTiec: tiecData,
        loading: false
      });

    } catch (error) {
      console.error("Error fetching details:", error);
      setBookingDetails(prev => ({ ...prev, loading: false }));
      alert("Không thể tải chi tiết món ăn/dịch vụ.");
    }
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
      setSelectedHoaDon(null); // Đóng modal sau khi update thành công (hoặc có thể giữ lại tùy ý)
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
  };

  // --- FILTERING ---
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

        {/* LIST */}
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
                        </div>
                    </div>

                    <div className="inv-card-footer">
                        <button className="inv-action-btn view" onClick={() => handleOpenDetailModal(inv)}>
                            <FaEdit /> Chi tiết & Cập nhật
                        </button>
                    </div>
                </div>
              ))
            )}
        </div>

        {/* MODAL CHI TIẾT & CẬP NHẬT */}
        {showUpdateModal && selectedHoaDon && (
          <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
            <div className="modal-content-invoice large-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Chi tiết hóa đơn #{selectedHoaDon.MaHoaDon}</h2>
                <div className="header-actions">
                    <button className="close-btn" onClick={() => setShowUpdateModal(false)}>
                        <FaTimes />
                    </button>
                </div>
              </div>
              
              <div className="modal-body-scroll">
                {bookingDetails.loading ? (
                    <div className="loading-spinner">Đang tải chi tiết...</div>
                ) : (
                    <>
                        {/* 1. Thông tin chung */}
                        <div className="invoice-section-grid">
                            <div className="section-col">
                                <h3>Thông tin tiệc</h3>
                                <p><strong>Cặp đôi:</strong> {selectedHoaDon.TenChuRe} & {selectedHoaDon.TenCoDau}</p>
                                <p><strong>Ngày đãi tiệc:</strong> {formatDate(selectedHoaDon.NgayDaiTiec)}</p>
                                <p><strong>Sảnh:</strong> {selectedHoaDon.TenSanh}</p>
                            </div>
                             <div className="section-col right-align">
                                <h3>Trạng thái thanh toán</h3>
                                <span className={`status-badge-lg ${getStatusClass(selectedHoaDon.TrangThai)}`}>
                                    {getStatusLabel(selectedHoaDon.TrangThai)}
                                </span>
                                <p className="payment-date">Ngày TT: {formatDate(selectedHoaDon.NgayThanhToan)}</p>
                            </div>
                        </div>

                        <hr className="divider-light"/>

                        {/* 2. Chi tiết Thực Đơn & Bàn Tiệc */}
                        <div className="detail-table-section">
                            <h4><FaUtensils/> Chi tiết Thực Đơn</h4>
                            <div className="table-responsive">
                                <table className="detail-table">
                                    <thead>
                                        <tr>
                                            <th>Món ăn</th>
                                            <th>Đơn giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookingDetails.monAn && bookingDetails.monAn.length > 0 ? (
                                            bookingDetails.monAn.map((mon, index) => (
                                                <tr key={index}>
                                                    <td>{mon.TenMonAn}</td>
                                                    <td>{formatCurrency(mon.DonGia || mon.DonGiaThoiDiemDat)} đ</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="2">Chưa có dữ liệu món ăn hoặc chưa cập nhật API</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Logic tính toán giá bàn sửa lại tại đây */}
                            <div className="sub-summary">
                                <div className="row">
                                    <span>Đơn giá bàn (TB):</span>
                                    {/* Lấy Tổng tiền bàn từ Hóa đơn chia cho Số lượng bàn từ Đặt tiệc */}
                                    <span>
                                      {formatCurrency(
                                        (bookingDetails.thongTinTiec?.SoLuongBan > 0) 
                                          ? (selectedHoaDon.TongTienBan / bookingDetails.thongTinTiec.SoLuongBan) 
                                          : 0
                                      )} đ
                                    </span> 
                                </div>
                                <div className="row">
                                    <span>Số lượng bàn:</span>
                                    <span>{bookingDetails.thongTinTiec?.SoLuongBan || 0}</span>
                                </div>
                                <div className="row total">
                                    <span>Tổng tiền bàn:</span>
                                    {/* Lấy trực tiếp từ Hóa đơn để chính xác */}
                                    <span>{formatCurrency(selectedHoaDon.TongTienBan)} đ</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Chi tiết Dịch vụ */}
                        <div className="detail-table-section">
                            <h4><FaCameraRetro/> Chi tiết Dịch Vụ</h4>
                            <table className="detail-table">
                                <thead>
                                    <tr>
                                        <th>Dịch vụ</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingDetails.dichVu && bookingDetails.dichVu.length > 0 ? (
                                        bookingDetails.dichVu.map((dv, index) => (
                                            <tr key={index}>
                                                <td>{dv.TenDichVu}</td>
                                                <td>{dv.SoLuong}</td>
                                                <td>{formatCurrency(dv.DonGiaThoiDiemDat)} đ</td>
                                                <td>{formatCurrency(dv.ThanhTien)} đ</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center">Không sử dụng dịch vụ</td></tr>
                                    )}
                                </tbody>
                            </table>
                             <div className="sub-summary">
                                <div className="row total">
                                    <span>Tổng tiền dịch vụ:</span>
                                    <span>{formatCurrency(selectedHoaDon.TongTienDichVu)} đ</span>
                                </div>
                            </div>
                        </div>

                        <hr className="divider-bold"/>

                        {/* 4. Tổng kết tài chính */}
                        <div className="final-summary">
                             <div className="summary-row">
                                <span>Tổng tiền bàn + Dịch vụ:</span>
                                <span>{formatCurrency(selectedHoaDon.TongTienBan + selectedHoaDon.TongTienDichVu)} đ</span>
                            </div>
                            {selectedHoaDon.TongTienPhat > 0 && (
                                <div className="summary-row penalty">
                                    <span>Phạt quá hạn ({selectedHoaDon.PhanTramPhatMotNgay}%/ngày):</span>
                                    <span>+ {formatCurrency(selectedHoaDon.TongTienPhat)} đ</span>
                                </div>
                            )}
                            <div className="summary-row big-total">
                                <span>TỔNG HÓA ĐƠN:</span>
                                <span>{formatCurrency(selectedHoaDon.TongTienHoaDon)} đ</span>
                            </div>
                             <div className="summary-row paid">
                                <span>Tiền cọc (Đã trả):</span>
                                {/* Lấy tiền đặt cọc từ thông tin tiệc */}
                                <span>- {formatCurrency(bookingDetails.thongTinTiec?.TienDatCoc || 0)} đ</span>
                            </div>
                             <div className="summary-row remaining">
                                <span>CÒN LẠI PHẢI THANH TOÁN:</span>
                                <span>{formatCurrency(selectedHoaDon.TongTienConLai)} đ</span>
                            </div>
                        </div>

                        {/* 5. Nút Cập nhật trạng thái */}
                        <div className="status-actions-container">
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
                    </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL TẠO HÓA ĐƠN MỚI */}
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
      </div>
    </div>
  );
};

export default InvoiceManagement;