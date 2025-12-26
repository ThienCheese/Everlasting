import React, { useState, useEffect } from 'react';
import './MenuManagement.css';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from "react-icons/fa";
import apiService from '../services/api';

const MenuManagement = () => {
  // ==================== STATE MANAGEMENT ====================
  
  // Món ăn
  const [danhSachMonAn, setDanhSachMonAn] = useState([]);
  const [monAnHienThi, setMonAnHienThi] = useState([]);
  const [danhMucHienTai, setDanhMucHienTai] = useState('all');
  const [searchMonAn, setSearchMonAn] = useState('');
  const [showMonAnModal, setShowMonAnModal] = useState(false);
  const [editingMonAn, setEditingMonAn] = useState(null);
  
  // Thực đơn mẫu
  const [danhSachThucDonMau, setDanhSachThucDonMau] = useState([]);
  const [searchThucDonMau, setSearchThucDonMau] = useState('');
  const [showThucDonMauModal, setShowThucDonMauModal] = useState(false);
  const [editingThucDonMau, setEditingThucDonMau] = useState(null);
  const [showManageMonAnModal, setShowManageMonAnModal] = useState(false);
  const [selectedThucDonMau, setSelectedThucDonMau] = useState(null);
  const [monAnInThucDonMau, setMonAnInThucDonMau] = useState([]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingThucDonMau, setViewingThucDonMau] = useState(null);
  const [detailViewMode, setDetailViewMode] = useState('table'); // 'cards' | 'table'
  
  // Loại món ăn
  const [danhSachLoaiMon, setDanhSachLoaiMon] = useState([]);
  const [searchLoaiMon, setSearchLoaiMon] = useState('');
  const [showLoaiMonModal, setShowLoaiMonModal] = useState(false);
  const [editingLoaiMon, setEditingLoaiMon] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== DATA FETCHING ====================
  
  const fetchMonAn = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllMonAn();
      setDanhSachMonAn(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching món ăn:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThucDonMau = async () => {
    try {
      const response = await apiService.getAllThucDonMau();
      setDanhSachThucDonMau(response.data || []);
    } catch (err) {
      console.error('Error fetching thực đơn mẫu:', err);
    }
  };

  const fetchLoaiMonAn = async () => {
    try {
      const response = await apiService.getAllLoaiMonAn();
      setDanhSachLoaiMon(response.data || []);
    } catch (err) {
      console.error('Error fetching loại món ăn:', err);
    }
  };

  useEffect(() => {
    fetchMonAn();
    fetchThucDonMau();
    fetchLoaiMonAn();
  }, []);

  // ==================== FILTERING & SEARCH ====================
  
  useEffect(() => {
    let filtered = danhSachMonAn;
    
    if (danhMucHienTai !== 'all') {
      filtered = filtered.filter(mon => mon.TenLoaiMonAn === danhMucHienTai);
    }
    
    if (searchMonAn.trim()) {
      filtered = filtered.filter(mon => 
        mon.TenMonAn?.toLowerCase().includes(searchMonAn.toLowerCase())
      );
    }
    
    setMonAnHienThi(filtered);
  }, [danhSachMonAn, danhMucHienTai, searchMonAn]);

  const danhSachTab = [
    { id: 'all', label: 'Tất cả' },
    ...Array.from(new Set(danhSachMonAn.map(mon => mon.TenLoaiMonAn)))
      .filter(Boolean)
      .map(ten => ({ id: ten, label: ten }))
  ];

  const thucDonMauFiltered = danhSachThucDonMau.filter(tdm =>
    tdm.TenThucDon?.toLowerCase().includes(searchThucDonMau.toLowerCase())
  );

  const loaiMonFiltered = danhSachLoaiMon.filter(loai =>
    loai.TenLoaiMonAn?.toLowerCase().includes(searchLoaiMon.toLowerCase())
  );

  // ==================== CRUD HANDLERS - MÓN ĂN ====================
  
  const handleCreateMonAn = () => {
    setEditingMonAn({
      tenMonAn: '',
      maLoaiMonAn: '',
      donGia: '',
      ghiChu: '',
      anhURL: ''
    });
    setShowMonAnModal(true);
  };

  const handleEditMonAn = (mon) => {
    setEditingMonAn({
      maMonAn: mon.MaMonAn,
      tenMonAn: mon.TenMonAn,
      maLoaiMonAn: mon.MaLoaiMonAn,
      donGia: mon.DonGia,
      ghiChu: mon.GhiChu || '',
      anhURL: mon.AnhURL || ''
    });
    setShowMonAnModal(true);
  };

  const handleSaveMonAn = async () => {
    try {
      setLoading(true);
      const payload = {
        tenMonAn: editingMonAn.tenMonAn,
        maLoaiMonAn: parseInt(editingMonAn.maLoaiMonAn),
        donGia: parseFloat(editingMonAn.donGia),
        ghiChu: editingMonAn.ghiChu,
        anhURL: editingMonAn.anhURL
      };

      if (editingMonAn.maMonAn) {
        await apiService.updateMonAn(editingMonAn.maMonAn, payload);
        alert('Cập nhật món ăn thành công!');
      } else {
        await apiService.createMonAn(payload);
        alert('Tạo món ăn thành công!');
      }

      setShowMonAnModal(false);
      setEditingMonAn(null);
      fetchMonAn();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMonAn = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return;

    try {
      setLoading(true);
      await apiService.deleteMonAn(id);
      alert('Xóa món ăn thành công!');
      fetchMonAn();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== CRUD HANDLERS - THỰC ĐƠN MẪU ====================
  
  const handleCreateThucDonMau = () => {
    setEditingThucDonMau({
      tenThucDon: '',
      donGiaHienTai: '',
      ghiChu: ''
    });
    setShowThucDonMauModal(true);
  };

  const handleEditThucDonMau = (tdm) => {
    setEditingThucDonMau({
      maThucDon: tdm.MaThucDon,
      tenThucDon: tdm.TenThucDon,
      ghiChu: tdm.GhiChu || '',
      donGiaHienTai: tdm.DonGiaHienTai
    });
    setShowThucDonMauModal(true);
  };

  const handleSaveThucDonMau = async () => {
    try {
      setLoading(true);
      const payload = {
        tenThucDon: editingThucDonMau.tenThucDon,
        ghiChu: editingThucDonMau.ghiChu,
        donGiaHienTai: parseFloat(editingThucDonMau.donGiaHienTai)
      };

      if (editingThucDonMau.maThucDon) {
        await apiService.updateThucDonMau(editingThucDonMau.maThucDon, payload);
        alert('Cập nhật thực đơn mẫu thành công!');
      } else {
        await apiService.createThucDonMau(payload);
        alert('Tạo thực đơn mẫu thành công!');
      }

      setShowThucDonMauModal(false);
      setEditingThucDonMau(null);
      fetchThucDonMau();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThucDonMau = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa thực đơn mẫu này?')) return;

    try {
      setLoading(true);
      await apiService.deleteThucDonMau(id);
      alert('Xóa thực đơn mẫu thành công!');
      fetchThucDonMau();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== QUẢN LÝ MÓN ĂN TRONG THỰC ĐƠN MẪU ====================

  const handleManageMonAn = async (thucDonMau) => {
    setSelectedThucDonMau(thucDonMau);
    setShowManageMonAnModal(true);
    
    try {
      setLoading(true);
      const response = await apiService.getMonAnThucDonMau(thucDonMau.MaThucDon);
      setMonAnInThucDonMau(response.data || []);
    } catch (err) {
      console.error('Error fetching món ăn:', err);
      setMonAnInThucDonMau([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMonAnToThucDonMau = async (maMonAn) => {
    if (!selectedThucDonMau) return;

    try {
      setLoading(true);
      await apiService.addMonAnToThucDonMau(selectedThucDonMau.MaThucDon, maMonAn);
      alert('Thêm món ăn thành công!');
      
      // Refresh danh sách món ăn
      const response = await apiService.getMonAnThucDonMau(selectedThucDonMau.MaThucDon);
      setMonAnInThucDonMau(response.data || []);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMonAnFromThucDonMau = async (maMonAn) => {
    if (!selectedThucDonMau) return;
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này khỏi thực đơn mẫu?')) return;

    try {
      setLoading(true);
      await apiService.removeMonAnFromThucDonMau(selectedThucDonMau.MaThucDon, maMonAn);
      alert('Xóa món ăn thành công!');
      
      // Refresh danh sách món ăn
      const response = await apiService.getMonAnThucDonMau(selectedThucDonMau.MaThucDon);
      setMonAnInThucDonMau(response.data || []);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  // Đặt hàm này gần khu vực handlers của Thực Đơn Mẫu

  const handleViewDetail = async (tdm) => {
  setViewingThucDonMau(tdm);
  setShowDetailModal(true);
  
  try {
    setLoading(true);
    // Tái sử dụng API lấy món ăn đã có
    const response = await apiService.getMonAnThucDonMau(tdm.MaThucDon);
    setMonAnInThucDonMau(response.data || []);
  } catch (err) {
    console.error('Error fetching detail:', err);
    setMonAnInThucDonMau([]);
  } finally {
    setLoading(false);
  }
};

  // ==================== CRUD HANDLERS - LOẠI MÓN ĂN ====================
  
  const handleCreateLoaiMon = () => {
    setEditingLoaiMon({
      tenLoaiMonAn: ''
    });
    setShowLoaiMonModal(true);
  };

  const handleEditLoaiMon = (loai) => {
    setEditingLoaiMon({
      maLoaiMonAn: loai.MaLoaiMonAn,
      tenLoaiMonAn: loai.TenLoaiMonAn
    });
    setShowLoaiMonModal(true);
  };

  const handleSaveLoaiMon = async () => {
    try {
      setLoading(true);
      const payload = {
        tenLoai: editingLoaiMon.tenLoaiMonAn
      };

      if (editingLoaiMon.maLoaiMonAn) {
        await apiService.updateLoaiMonAn(editingLoaiMon.maLoaiMonAn, payload);
        alert('Cập nhật loại món ăn thành công!');
      } else {
        await apiService.createLoaiMonAn(payload);
        alert('Tạo loại món ăn thành công!');
      }

      setShowLoaiMonModal(false);
      setEditingLoaiMon(null);
      fetchLoaiMonAn();
      fetchMonAn();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLoaiMon = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa loại món ăn này?')) return;

    try {
      setLoading(true);
      await apiService.deleteLoaiMonAn(id);
      alert('Xóa loại món ăn thành công!');
      fetchLoaiMonAn();
      fetchMonAn();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================
  
  return (
    <div className="management-container">
      <div className="content-body">
        
        {/* ==================== SECTION 1: QUẢN LÝ MÓN ĂN ==================== */}
        <section className="section-block">
          <div className="section-header-row">
            <h2 className="section-title">Quản lý món ăn</h2>
            
            <div className="controls-group">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Tìm tên món..." 
                  value={searchMonAn}
                  onChange={(e) => setSearchMonAn(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              <button className="add-btn" onClick={handleCreateMonAn}>
                <FaPlus /> Thêm món mới
              </button>
            </div>
          </div>

          <div className="menu-tabs">
            {danhSachTab.map(tab => (
              <button 
                key={tab.id}
                className={`tab-btn ${danhMucHienTai === tab.id ? 'active' : ''}`}
                onClick={() => setDanhMucHienTai(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && <p>Đang tải...</p>}
          {error && <p className="error-message">{error}</p>}
          
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{width: '10%'}}>Hình</th>
                <th style={{width: '25%'}}>Tên món ăn</th>
                <th style={{width: '15%'}}>Danh mục</th>
                <th style={{width: '15%'}}>Đơn giá</th>
                <th style={{width: '20%'}}>Ghi chú</th>
                <th style={{width: '15%'}} className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {monAnHienThi.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">Không có dữ liệu</td>
                </tr>
              ) : (
                monAnHienThi.map((mon) => (
                  <tr key={mon.MaMonAn}>
                    <td>
                      {mon.AnhURL ? (
                        <img src={mon.AnhURL} alt={mon.TenMonAn} className="menu-thumbnail" />
                      ) : (
                        <div className="menu-thumbnail-placeholder">No Image</div>
                      )}
                    </td>
                    <td style={{fontWeight: '600', color: '#333'}}>{mon.TenMonAn}</td>
                    <td>
                      <span className="category-badge">{mon.TenLoaiMonAn}</span>
                    </td>
                    <td style={{fontWeight: 'bold', color: '#8A7CDF'}}>
                      {Number(mon.DonGia).toLocaleString('vi-VN')} đ
                    </td>
                    <td style={{fontSize: '13px', color: '#555'}}>
                      {mon.GhiChu || '-'}
                    </td>
                    <td className="text-center">
                      <div className="action-cells">
                        <button 
                          className="icon-btn edit-btn" 
                          title="Sửa"
                          onClick={() => handleEditMonAn(mon)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="icon-btn delete-btn" 
                          title="Xóa"
                          onClick={() => handleDeleteMonAn(mon.MaMonAn)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* ==================== SECTION 2: QUẢN LÝ THỰC ĐƠN MẪU ==================== */}
        <section className="section-block">
          <div className="section-header-row">
            <h2 className="section-title">Quản lý thực đơn mẫu</h2>
            
            <div className="controls-group">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Tìm thực đơn mẫu..." 
                  value={searchThucDonMau}
                  onChange={(e) => setSearchThucDonMau(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              <button className="add-btn" onClick={handleCreateThucDonMau}>
                <FaPlus /> Thêm thực đơn mẫu
              </button>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th style={{width: '20%'}}>Tên thực đơn</th>
                <th style={{width: '15%'}}>Đơn giá hiện tại</th>
                <th style={{width: '40%'}}>Ghi chú</th>
                <th style={{width: '10%'}} className="text-center">Món ăn</th>
                <th style={{width: '15%'}} className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {thucDonMauFiltered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">Không có dữ liệu</td>
                </tr>
              ) : (
                thucDonMauFiltered.map((tdm) => (
                  <tr key={tdm.MaThucDon}>
                    <td>
                      <button 
                        className="set-name-link"
                        onClick={() => handleViewDetail(tdm)}
                        title="Xem chi tiết thực đơn"
                      >
                        {tdm.TenThucDon}
                      </button>
                    </td>
                    <td style={{fontWeight: '600', color: '#8A7CDF'}}>
                      {Number(tdm.DonGiaHienTai).toLocaleString('vi-VN')} đ
                    </td>
                    <td style={{fontSize: '13px', lineHeight: '1.5', color: '#555'}}>
                      {tdm.GhiChu || '-'}
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn-manage-dishes"
                        onClick={() => handleManageMonAn(tdm)}
                        title="Quản lý món ăn"
                      >
                        <FaPlus /> Món ăn
                      </button>
                    </td>
                    <td className="text-center">
                      <div className="action-cells">
                        <button 
                          className="icon-btn edit-btn"
                          onClick={() => handleEditThucDonMau(tdm)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="icon-btn delete-btn"
                          onClick={() => handleDeleteThucDonMau(tdm.MaThucDon)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* ==================== SECTION 3: DANH SÁCH LOẠI MÓN ==================== */}
        <section className="section-block">
          <div className="section-header-row">
            <h2 className="section-title">Danh sách loại món</h2>
            
            <div className="controls-group">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Tìm loại món..." 
                  value={searchLoaiMon}
                  onChange={(e) => setSearchLoaiMon(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              <button className="add-btn" onClick={handleCreateLoaiMon}>
                <FaPlus /> Thêm loại món
              </button>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th style={{width: '80%'}}>Loại món ăn</th>
                <th style={{width: '20%'}} className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loaiMonFiltered.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center">Không có dữ liệu</td>
                </tr>
              ) : (
                loaiMonFiltered.map((loai) => (
                  <tr key={loai.MaLoaiMonAn}>
                    <td style={{fontWeight: 'bold', fontSize: '15px'}}>{loai.TenLoaiMonAn}</td>
                    <td className="text-center">
                      <div className="action-cells">
                        <button 
                          className="icon-btn edit-btn"
                          onClick={() => handleEditLoaiMon(loai)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="icon-btn delete-btn"
                          onClick={() => handleDeleteLoaiMon(loai.MaLoaiMonAn)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* ==================== MODALS ==================== */}
      
      {/* Modal Món Ăn */}
      {showMonAnModal && editingMonAn && (
        <div className="modal-overlay" onClick={() => setShowMonAnModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMonAn.maMonAn ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</h3>
              <button className="close-btn" onClick={() => setShowMonAnModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tên món ăn *</label>
                <input
                  type="text"
                  value={editingMonAn.tenMonAn}
                  onChange={(e) => setEditingMonAn({...editingMonAn, tenMonAn: e.target.value})}
                  placeholder="Nhập tên món ăn"
                />
              </div>

              <div className="form-group">
                <label>Loại món *</label>
                <select
                  value={editingMonAn.maLoaiMonAn}
                  onChange={(e) => setEditingMonAn({...editingMonAn, maLoaiMonAn: e.target.value})}
                >
                  <option value="">-- Chọn loại món --</option>
                  {danhSachLoaiMon.map(loai => (
                    <option key={loai.MaLoaiMonAn} value={loai.MaLoaiMonAn}>
                      {loai.TenLoaiMonAn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Đơn giá *</label>
                <input
                  type="number"
                  value={editingMonAn.donGia}
                  onChange={(e) => setEditingMonAn({...editingMonAn, donGia: e.target.value})}
                  placeholder="Nhập đơn giá"
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={editingMonAn.ghiChu}
                  onChange={(e) => setEditingMonAn({...editingMonAn, ghiChu: e.target.value})}
                  placeholder="Nhập ghi chú món ăn"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>URL hình ảnh</label>
                <input
                  type="text"
                  value={editingMonAn.anhURL}
                  onChange={(e) => setEditingMonAn({...editingMonAn, anhURL: e.target.value})}
                  placeholder="Nhập URL hình ảnh"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowMonAnModal(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSaveMonAn} disabled={loading}>
                <FaSave /> {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thực Đơn Mẫu */}
      {showThucDonMauModal && editingThucDonMau && (
        <div className="modal-overlay" onClick={() => setShowThucDonMauModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingThucDonMau.maThucDon ? 'Chỉnh sửa thực đơn mẫu' : 'Thêm thực đơn mẫu'}</h3>
              <button className="close-btn" onClick={() => setShowThucDonMauModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tên thực đơn *</label>
                <input
                  type="text"
                  value={editingThucDonMau.tenThucDon}
                  onChange={(e) => setEditingThucDonMau({...editingThucDonMau, tenThucDon: e.target.value})}
                  placeholder="Nhập tên thực đơn"
                />
              </div>

              <div className="form-group">
                <label>Đơn giá hiện tại *</label>
                <input
                  type="number"
                  value={editingThucDonMau.donGiaHienTai}
                  onChange={(e) => setEditingThucDonMau({...editingThucDonMau, donGiaHienTai: e.target.value})}
                  placeholder="Nhập đơn giá hiện tại"
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={editingThucDonMau.ghiChu}
                  onChange={(e) => setEditingThucDonMau({...editingThucDonMau, ghiChu: e.target.value})}
                  placeholder="Nhập ghi chú thực đơn"
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowThucDonMauModal(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSaveThucDonMau} disabled={loading}>
                <FaSave /> {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Loại Món */}
      {showLoaiMonModal && editingLoaiMon && (
        <div className="modal-overlay" onClick={() => setShowLoaiMonModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingLoaiMon.maLoaiMonAn ? 'Chỉnh sửa loại món' : 'Thêm loại món'}</h3>
              <button className="close-btn" onClick={() => setShowLoaiMonModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tên loại món *</label>
                <input
                  type="text"
                  value={editingLoaiMon.tenLoaiMonAn}
                  onChange={(e) => setEditingLoaiMon({...editingLoaiMon, tenLoaiMonAn: e.target.value})}
                  placeholder="Nhập tên loại món"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowLoaiMonModal(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSaveLoaiMon} disabled={loading}>
                <FaSave /> {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Quản lý Món ăn trong Thực đơn mẫu */}
      {showManageMonAnModal && selectedThucDonMau && (
        <div className="modal-overlay" onClick={() => setShowManageMonAnModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quản lý món ăn - {selectedThucDonMau.TenThucDon}</h3>
              <button className="close-btn" onClick={() => setShowManageMonAnModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Section thêm món ăn */}
              <div className="add-dish-section">
                <h4>Thêm món ăn vào thực đơn</h4>
                <div className="form-group">
                  <label>Chọn món ăn</label>
                  <select 
                    className="dish-select"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddMonAnToThucDonMau(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">-- Chọn món ăn để thêm --</option>
                    {danhSachMonAn
                      .filter(mon => !monAnInThucDonMau.some(m => m.MaMonAn === mon.MaMonAn))
                      .map(mon => (
                        <option key={mon.MaMonAn} value={mon.MaMonAn}>
                          {mon.TenMonAn} - {Number(mon.DonGia).toLocaleString('vi-VN')} đ
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>

              {/* Danh sách món ăn hiện tại */}
              <div className="current-dishes-section">
                <h4>Danh sách món ăn ({monAnInThucDonMau.length})</h4>
                {loading ? (
                  <p className="text-center">Đang tải...</p>
                ) : monAnInThucDonMau.length === 0 ? (
                  <p className="no-data">Chưa có món ăn nào trong thực đơn mẫu này</p>
                ) : (
                  <div className="dishes-list">
                    {monAnInThucDonMau.map((mon) => (
                      <div key={mon.MaMonAn} className="dish-item">
                        <div className="dish-info">
                          <div className="dish-name">{mon.TenMonAn}</div>
                          <div className="dish-category">{mon.TenLoaiMonAn}</div>
                          <div className="dish-price">{Number(mon.DonGia).toLocaleString('vi-VN')} đ</div>
                        </div>
                        <button 
                          className="btn-remove-dish"
                          onClick={() => handleRemoveMonAnFromThucDonMau(mon.MaMonAn)}
                          title="Xóa món này"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowManageMonAnModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==================== MODAL XEM CHI TIẾT THỰC ĐƠN ==================== */}
        {showDetailModal && viewingThucDonMau && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết thực đơn: {viewingThucDonMau.TenThucDon}</h3>
                <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body detail-body">
                {(() => {
                  const tongTien = monAnInThucDonMau.reduce((sum, m) => sum + Number(m.DonGia || 0), 0);
                  const chenhLech = tongTien - Number(viewingThucDonMau.DonGiaHienTai || 0);
                  const byCategory = monAnInThucDonMau.reduce((acc, m) => {
                    const key = m.TenLoaiMonAn || 'Khác';
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                  }, {});

                  return (
                    <div className="detail-grid">
                      <div className="summary-cards">
                        <div className="metric-card primary">
                          <div className="metric-title">Giá set niêm yết</div>
                          <div className="metric-value">
                            {Number(viewingThucDonMau.DonGiaHienTai).toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                        <div className="metric-card success">
                          <div className="metric-title">Tổng giá trị món</div>
                          <div className="metric-value">
                            {tongTien.toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                        <div className={`metric-card ${chenhLech <= 0 ? 'saving' : 'warning'}`}>
                          <div className="metric-title">{chenhLech <= 0 ? 'Tiết kiệm' : 'Chênh lệch'}</div>
                          <div className="metric-value">
                            {Math.abs(chenhLech).toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                      </div>

                      <div className="chips-row">
                        {Object.entries(byCategory).map(([cat, count]) => (
                          <span key={cat} className="chip">
                            {cat} · {count} món
                          </span>
                        ))}
                      </div>

                      <div className="note-card">
                        <div className="note-title">Ghi chú</div>
                        <div className="note-content">{viewingThucDonMau.GhiChu || 'Không có'}</div>
                      </div>

                      <h4 className="section-heading">Danh sách món ăn ({monAnInThucDonMau.length})</h4>
                      <div className="view-switch">
                        <button
                          className={`pill-btn ${detailViewMode === 'cards' ? 'active' : ''}`}
                          onClick={() => setDetailViewMode('cards')}
                        >
                          Xem dạng thẻ
                        </button>
                        <button
                          className={`pill-btn ${detailViewMode === 'table' ? 'active' : ''}`}
                          onClick={() => setDetailViewMode('table')}
                        >
                          Xem dạng bảng
                        </button>
                      </div>

                      {loading ? (
                        <p className="text-center">Đang tải chi tiết...</p>
                      ) : detailViewMode === 'table' ? (
                        <div className="table-wrapper">
                          <table className="detail-table">
                            <thead>
                              <tr>
                                <th style={{width:'10%'}}>Hình</th>
                                <th style={{width:'35%'}}>Tên món ăn</th>
                                <th style={{width:'20%'}}>Loại</th>
                                <th style={{width:'15%'}}>Đơn giá</th>
                                <th style={{width:'20%'}}>Ghi chú</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monAnInThucDonMau.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center">Chưa có món ăn</td>
                                </tr>
                              ) : (
                                monAnInThucDonMau.map((mon) => (
                                  <tr key={mon.MaMonAn}>
                                    <td>
                                      <img
                                        className="detail-thumb"
                                        src={mon.AnhURL || 'https://via.placeholder.com/120?text=No+Image'}
                                        alt={mon.TenMonAn}
                                        onError={(e) => {e.target.onerror = null; e.target.src='https://via.placeholder.com/120?text=Error'}}
                                      />
                                    </td>
                                    <td className="bold-col" title={mon.TenMonAn}>{mon.TenMonAn}</td>
                                    <td><span className="category-badge">{mon.TenLoaiMonAn}</span></td>
                                    <td className="price-col">{Number(mon.DonGia).toLocaleString('vi-VN')} đ</td>
                                    <td className="note-col">{mon.GhiChu || '-'}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="dish-card-grid">
                          {monAnInThucDonMau.map((mon) => (
                            <div key={mon.MaMonAn} className="dish-card">
                              <div className="dish-image">
                                <img 
                                  src={mon.AnhURL || 'https://via.placeholder.com/240?text=No+Image'} 
                                  alt={mon.TenMonAn}
                                  onError={(e) => {e.target.onerror = null; e.target.src='https://via.placeholder.com/240?text=Error'}}
                                />
                                <span className="dish-chip">{mon.TenLoaiMonAn}</span>
                              </div>
                              <div className="dish-card-body">
                                <div className="dish-card-title" title={mon.TenMonAn}>{mon.TenMonAn}</div>
                                <div className="dish-card-price">{Number(mon.DonGia).toLocaleString('vi-VN')} đ</div>
                                <div className="dish-card-note">{mon.GhiChu || ''}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="modal-footer">
                <button className="btn-primary" onClick={() => setShowDetailModal(false)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default MenuManagement;
