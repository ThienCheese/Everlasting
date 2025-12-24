import React, { useState, useEffect } from 'react';
import './ServiceManagement.css'; 
import { FaSearch, FaPlus, FaEdit, FaTrash, FaStar, FaFilter, FaChevronDown, FaCheck, FaTimes, FaSave } from "react-icons/fa";
import apiService from '../services/api';

const ServiceManagement = () => {
  // ==================== STATE MANAGEMENT ====================
  const [danhSachDichVu, setDanhSachDichVu] = useState([]);
  const [danhSachLoaiDichVu, setDanhSachLoaiDichVu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingDichVu, setEditingDichVu] = useState(null);
  const [showLoaiDichVuModal, setShowLoaiDichVuModal] = useState(false);
  const [editingLoaiDichVu, setEditingLoaiDichVu] = useState(null);

  // ==================== DATA FETCHING ====================
  
  const fetchDichVu = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllDichVu();
      setDanhSachDichVu(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dịch vụ:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoaiDichVu = async () => {
    try {
      const response = await apiService.getAllLoaiDichVu();
      setDanhSachLoaiDichVu(response.data || []);
    } catch (err) {
      console.error('Error fetching loại dịch vụ:', err);
    }
  };

  useEffect(() => {
    fetchDichVu();
    fetchLoaiDichVu();
  }, []);

  // ==================== FILTERING & SEARCH ====================
  
  const filteredServices = danhSachDichVu.filter(dv => {
    // Search by name
    const matchSearch = dv.TenDichVu?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(dv.TenLoaiDichVu);
    
    // Filter by price range
    const price = parseFloat(dv.DonGia);
    const matchPrice = 
      (priceMin === '' || price >= parseFloat(priceMin)) &&
      (priceMax === '' || price <= parseFloat(priceMax));
    
    return matchSearch && matchCategory && matchPrice;
  });

  // Sort
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch(sortBy) {
      case 'price-asc':
        return parseFloat(a.DonGia) - parseFloat(b.DonGia);
      case 'price-desc':
        return parseFloat(b.DonGia) - parseFloat(a.DonGia);
      case 'name':
        return a.TenDichVu.localeCompare(b.TenDichVu);
      default: // newest
        return b.MaDichVu - a.MaDichVu;
    }
  });

  // ==================== CATEGORY FILTER ====================

  // ==================== CATEGORY FILTER ====================
  
  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceMin('');
    setPriceMax('');
    setSearchTerm('');
  };

  // ==================== CRUD HANDLERS ====================
  
  const handleCreateDichVu = () => {
    setEditingDichVu({
      tenDichVu: '',
      maLoaiDichVu: '',
      donGia: '',
      ghiChu: '',
      anhURL: ''
    });
    setShowModal(true);
  };

  const handleEditDichVu = (dv) => {
    setEditingDichVu({
      maDichVu: dv.MaDichVu,
      tenDichVu: dv.TenDichVu,
      maLoaiDichVu: dv.MaLoaiDichVu,
      donGia: dv.DonGia,
      ghiChu: dv.GhiChu || '',
      anhURL: dv.AnhURL || ''
    });
    setShowModal(true);
  };

  const handleSaveDichVu = async () => {
    try {
      setLoading(true);
      const payload = {
        tenDichVu: editingDichVu.tenDichVu,
        maLoaiDichVu: parseInt(editingDichVu.maLoaiDichVu),
        donGia: parseFloat(editingDichVu.donGia),
        ghiChu: editingDichVu.ghiChu,
        anhURL: editingDichVu.anhURL
      };

      if (editingDichVu.maDichVu) {
        await apiService.updateDichVu(editingDichVu.maDichVu, payload);
        alert('Cập nhật dịch vụ thành công!');
      } else {
        await apiService.createDichVu(payload);
        alert('Tạo dịch vụ thành công!');
      }

      setShowModal(false);
      setEditingDichVu(null);
      fetchDichVu();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDichVu = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;

    try {
      setLoading(true);
      await apiService.deleteDichVu(id);
      alert('Xóa dịch vụ thành công!');
      fetchDichVu();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOẠI DỊCH VỤ HANDLERS ====================
  
  const handleCreateLoaiDichVu = () => {
    setEditingLoaiDichVu({ tenLoai: '' });
    setShowLoaiDichVuModal(true);
  };

  const handleSaveLoaiDichVu = async () => {
    try {
      setLoading(true);
      const payload = { tenLoai: editingLoaiDichVu.tenLoai };

      if (editingLoaiDichVu.maLoaiDichVu) {
        await apiService.updateLoaiDichVu(editingLoaiDichVu.maLoaiDichVu, payload);
        alert('Cập nhật loại dịch vụ thành công!');
      } else {
        await apiService.createLoaiDichVu(payload);
        alert('Tạo loại dịch vụ thành công!');
      }

      setShowLoaiDichVuModal(false);
      setEditingLoaiDichVu(null);
      fetchLoaiDichVu();
      fetchDichVu();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

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
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm dịch vụ..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                </div>
                <button className="add-btn glass-btn" onClick={handleCreateDichVu}>
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
                    <button className="btn-clear" onClick={clearFilters}>Xóa tất cả</button>
                </div>

                {/* Nhóm lọc 1: Danh mục */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Danh mục</span>
                        <FaChevronDown className="icon-chevron"/>
                    </div>
                    <div className="filter-options">
                        {danhSachLoaiDichVu.map(loai => (
                            <label key={loai.MaLoaiDichVu} className="custom-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCategories.includes(loai.TenLoaiDichVu)}
                                    onChange={() => toggleCategory(loai.TenLoaiDichVu)}
                                />
                                <span className="checkmark"><FaCheck className="icon-check"/></span>
                                <span className="label-text">{loai.TenLoaiDichVu}</span>
                            </label>
                        ))}
                    </div>
                    <button className="btn-add-category" onClick={handleCreateLoaiDichVu}>
                        <FaPlus /> Thêm loại mới
                    </button>
                </div>

                {/* Nhóm lọc 2: Khoảng giá */}
                <div className="filter-group">
                    <div className="filter-title">
                        <span>Khoảng giá</span>
                        <FaChevronDown className="icon-chevron"/>
                    </div>
                    <div className="price-inputs">
                        <input 
                          type="number" 
                          placeholder="Thấp nhất" 
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                        />
                        <span>-</span>
                        <input 
                          type="number" 
                          placeholder="Cao nhất" 
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                        />
                    </div>
                </div>
            </aside>

            {/* CỘT PHẢI: GRID DỊCH VỤ */}
            <main className="service-content">
                <div className="content-header-bar">
                    <span className="result-count">Hiển thị {sortedServices.length} kết quả</span>
                    <select 
                      className="sort-dropdown"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                        <option value="name">Tên A-Z</option>
                    </select>
                </div>

                {loading && <p className="text-center">Đang tải...</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="knot-style-grid">
                    {sortedServices.length === 0 ? (
                        <p className="no-data">Không có dịch vụ nào</p>
                    ) : (
                        sortedServices.map(service => (
                            <div key={service.MaDichVu} className="knot-card">
                                <div className="card-img-wrapper">
                                    {service.AnhURL ? (
                                        <img src={service.AnhURL} alt={service.TenDichVu} />
                                    ) : (
                                        <div className="no-image-placeholder">No Image</div>
                                    )}
                                    <div className="card-actions">
                                        <button 
                                            className="btn-icon edit" 
                                            onClick={() => handleEditDichVu(service)}
                                            title="Sửa"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="btn-icon delete" 
                                            onClick={() => handleDeleteDichVu(service.MaDichVu)}
                                            title="Xóa"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <div className="price-badge">
                                        {Number(service.DonGia).toLocaleString('vi-VN')} đ
                                    </div>
                                </div>
                                
                                <div className="card-details">
                                    <div className="brand-label">{service.TenLoaiDichVu}</div>
                                    <h3 className="service-title">{service.TenDichVu}</h3>
                                    {service.GhiChu && (
                                        <p className="service-description">{service.GhiChu}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

        </div>
      </div>

      {/* ==================== MODAL DỊCH VỤ ==================== */}
      {showModal && editingDichVu && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDichVu.maDichVu ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tên dịch vụ *</label>
                <input
                  type="text"
                  value={editingDichVu.tenDichVu}
                  onChange={(e) => setEditingDichVu({...editingDichVu, tenDichVu: e.target.value})}
                  placeholder="Nhập tên dịch vụ"
                />
              </div>

              <div className="form-group">
                <label>Loại dịch vụ *</label>
                <select
                  value={editingDichVu.maLoaiDichVu}
                  onChange={(e) => setEditingDichVu({...editingDichVu, maLoaiDichVu: e.target.value})}
                >
                  <option value="">-- Chọn loại dịch vụ --</option>
                  {danhSachLoaiDichVu.map(loai => (
                    <option key={loai.MaLoaiDichVu} value={loai.MaLoaiDichVu}>
                      {loai.TenLoaiDichVu}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Đơn giá *</label>
                <input
                  type="number"
                  value={editingDichVu.donGia}
                  onChange={(e) => setEditingDichVu({...editingDichVu, donGia: e.target.value})}
                  placeholder="Nhập đơn giá"
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={editingDichVu.ghiChu}
                  onChange={(e) => setEditingDichVu({...editingDichVu, ghiChu: e.target.value})}
                  placeholder="Nhập ghi chú dịch vụ"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>URL hình ảnh</label>
                <input
                  type="text"
                  value={editingDichVu.anhURL}
                  onChange={(e) => setEditingDichVu({...editingDichVu, anhURL: e.target.value})}
                  placeholder="Nhập URL hình ảnh"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSaveDichVu} disabled={loading}>
                <FaSave /> {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL LOẠI DỊCH VỤ ==================== */}
      {showLoaiDichVuModal && editingLoaiDichVu && (
        <div className="modal-overlay" onClick={() => setShowLoaiDichVuModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm loại dịch vụ mới</h3>
              <button className="close-btn" onClick={() => setShowLoaiDichVuModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tên loại dịch vụ *</label>
                <input
                  type="text"
                  value={editingLoaiDichVu.tenLoai}
                  onChange={(e) => setEditingLoaiDichVu({...editingLoaiDichVu, tenLoai: e.target.value})}
                  placeholder="Nhập tên loại dịch vụ"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowLoaiDichVuModal(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={handleSaveLoaiDichVu} disabled={loading}>
                <FaSave /> {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;