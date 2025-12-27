import React, { useState, useEffect } from 'react';
import './ManagementPage.css';
import { FaSearch, FaEdit, FaTrash, FaClock, FaCloudSun, FaSun, FaMoon, FaStar } from "react-icons/fa";
import apiService from '../services/api';

const ManagementPage = () => {
  // State management
  const [shifts, setShifts] = useState([]);
  const [halls, setHalls] = useState([]);
  const [hallTypes, setHallTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showCaModal, setShowCaModal] = useState(false);
  const [showSanhModal, setShowSanhModal] = useState(false);
  const [showLoaiSanhModal, setShowLoaiSanhModal] = useState(false);
  const [editingCa, setEditingCa] = useState(null);
  const [editingSanh, setEditingSanh] = useState(null);
  const [editingLoaiSanh, setEditingLoaiSanh] = useState(null);

  // Search state
  const [searchCa, setSearchCa] = useState('');
  const [searchSanh, setSearchSanh] = useState('');
  const [searchLoaiSanh, setSearchLoaiSanh] = useState('');

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [caData, sanhData, loaiSanhData] = await Promise.all([
        apiService.getCa(),
        apiService.getSanh(),
        apiService.getLoaiSanh(),
      ]);
      setShifts(caData.data || []);
      setHalls(sanhData.data || []);
      setHallTypes(loaiSanhData.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };
  

  // Icon mapping
  const getShiftIcon = (tenCa) => {
    const name = tenCa?.toLowerCase() || '';
    if (name.includes('sáng')) return <FaCloudSun style={{color: '#FDB813'}}/>;
    if (name.includes('trưa')) return <FaSun style={{color: '#FF8C00'}}/>;
    if (name.includes('chiều')) return <FaSun style={{color: '#FF6347'}}/>;
    if (name.includes('tối')) return <FaMoon style={{color: '#4169E1'}}/>;
    if (name.includes('đêm')) return <FaStar style={{color: '#FFD700'}}/>;
    return <FaClock style={{color: '#8A7CDF'}}/>;
  };

  // Ca handlers
  const handleAddCa = () => { setEditingCa(null); setShowCaModal(true); };
  const handleEditCa = (ca) => { setEditingCa(ca); setShowCaModal(true); };
  const handleDeleteCa = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ca này?')) return;
    try {
      await apiService.deleteCa(id);
      await loadAllData();
      alert('Xóa ca thành công!');
    } catch (err) { alert(err.message); }
  };
  const handleSaveCa = async (caData) => {
    try {
      if (editingCa) {
        await apiService.updateCa(editingCa.MaCa, caData);
        alert('Cập nhật ca thành công!');
      } else {
        await apiService.createCa(caData);
        alert('Thêm ca thành công!');
      }
      setShowCaModal(false);
      await loadAllData();
    } catch (err) { alert(err.message); }
  };

  // Sanh handlers
  const handleAddSanh = () => { setEditingSanh(null); setShowSanhModal(true); };
  const handleEditSanh = (sanh) => { setEditingSanh(sanh); setShowSanhModal(true); };
  const handleDeleteSanh = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sảnh này?')) return;
    try {
      await apiService.deleteSanh(id);
      await loadAllData();
      alert('Xóa sảnh thành công!');
    } catch (err) { alert(err.message); }
  };
  const handleSaveSanh = async (sanhData) => {
    try {
      if (editingSanh) {
        await apiService.updateSanh(editingSanh.MaSanh, sanhData);
        alert('Cập nhật sảnh thành công!');
      } else {
        await apiService.createSanh(sanhData);
        alert('Thêm sảnh thành công!');
      }
      setShowSanhModal(false);
      await loadAllData();
    } catch (err) { alert(err.message); }
  };

  // LoaiSanh handlers
  const handleAddLoaiSanh = () => { setEditingLoaiSanh(null); setShowLoaiSanhModal(true); };
  const handleEditLoaiSanh = (loaiSanh) => { setEditingLoaiSanh(loaiSanh); setShowLoaiSanhModal(true); };
  const handleDeleteLoaiSanh = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa loại sảnh này?')) return;
    try {
      await apiService.deleteLoaiSanh(id);
      await loadAllData();
      alert('Xóa loại sảnh thành công!');
    } catch (err) { alert(err.message); }
  };
  const handleSaveLoaiSanh = async (loaiSanhData) => {
    try {
      if (editingLoaiSanh) {
        await apiService.updateLoaiSanh(editingLoaiSanh.MaLoaiSanh, loaiSanhData);
        alert('Cập nhật loại sảnh thành công!');
      } else {
        await apiService.createLoaiSanh(loaiSanhData);
        alert('Thêm loại sảnh thành công!');
      }
      setShowLoaiSanhModal(false);
      await loadAllData();
    } catch (err) { alert(err.message); }
  };

  // Filter data
  const filteredShifts = shifts.filter(ca => ca.TenCa?.toLowerCase().includes(searchCa.toLowerCase()));
  const filteredHalls = halls.filter(sanh => sanh.TenSanh?.toLowerCase().includes(searchSanh.toLowerCase()));
  const filteredHallTypes = hallTypes.filter(loai => loai.TenLoaiSanh?.toLowerCase().includes(searchLoaiSanh.toLowerCase()));

  if (loading) return <div className="management-container"><div style={{textAlign: 'center', padding: '50px'}}><p>Đang tải dữ liệu...</p></div></div>;
  if (error) return <div className="management-container"><div style={{textAlign: 'center', padding: '50px', color: 'red'}}><p>Lỗi: {error}</p><button onClick={loadAllData} style={{marginTop: '20px'}}>Thử lại</button></div></div>;

  return (
    <div className="management-container">
      <div className="content-body">
        
        {/* --- PHẦN 1: QUẢN LÝ CA (Đã cập nhật dùng Icon) --- */}
        <section className="section-block">
          <div className="section-header-row">
            <h2 className="section-title">Quản lý ca</h2>
            <div className="controls-group">
                <div className="search-box">
                    <input type="text" placeholder="Tìm ca..." value={searchCa} onChange={(e) => setSearchCa(e.target.value)} />
                    <FaSearch className="search-icon" />
                </div>
                <button className="add-btn" onClick={handleAddCa}>Thêm ca</button>
            </div>
          </div>

          <table className="custom-table shift-table">
            <thead>
              <tr>
                <th style={{width: '40%'}}>Tên ca</th>
                <th style={{width: '45%'}}>Thông tin</th>
                <th style={{width: '15%'}} className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredShifts.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Không có dữ liệu</td></tr>
              ) : (
                filteredShifts.map((shift) => (
                  <tr key={shift.MaCa}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div className="shift-icon-box">{getShiftIcon(shift.TenCa)}</div>
                          <span style={{fontWeight: 'bold', fontSize: '15px'}}>{shift.TenCa}</span>
                      </div>
                    </td>
                    <td colSpan="2">
                      <div style={{fontSize: '14px', color: '#666', fontStyle: 'italic'}}>Ca làm việc</div>
                    </td>
                    <td className="text-right">
                      <div className="action-cells" style={{justifyContent: 'flex-end'}}>
                          <button className="icon-btn edit-btn" title="Sửa" onClick={() => handleEditCa(shift)}><FaEdit /></button>
                          <button className="icon-btn delete-btn" title="Xóa" onClick={() => handleDeleteCa(shift.MaCa)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* --- PHẦN 2: QUẢN LÝ SẢNH (Đã cập nhật dùng Icon) --- */}
        <section className="section-block mt-large">
          <div className="section-header-row">
            <h2 className="section-title">Quản lý sảnh</h2>
            <div className="controls-group">
                <div className="search-box">
                  <input type="text" placeholder="Tìm sảnh..." value={searchSanh} onChange={(e) => setSearchSanh(e.target.value)} />
                  <FaSearch className="search-icon" />
                </div>
                <button className="add-btn" onClick={handleAddSanh}>Thêm sảnh</button>
            </div>
          </div>

          <table className="custom-table hall-table">
            <thead>
              <tr>
                <th style={{width: '20%'}}>Tên sảnh</th>
                <th style={{width: '10%'}}>Loại</th>
                <th style={{width: '10%', textAlign: 'center'}}>Bàn tối đa</th>
                <th style={{width: '35%'}}>Ghi chú</th>
                <th style={{width: '15%'}}>Hình</th>
                <th style={{width: '10%'}} className="text-right">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {filteredHalls.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Không có dữ liệu</td></tr>
              ) : (
                filteredHalls.map((hall) => (
                  <tr key={hall.MaSanh}>
                    <td style={{fontWeight: 'bold'}}>{hall.TenSanh}</td>
                    <td><span style={{padding: '4px 8px', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px'}}>{hall.TenLoaiSanh || 'N/A'}</span></td>
                    <td className="text-center">{hall.SoLuongBanToiDa}</td>
                    <td className="note-text">{hall.GhiChu || 'Không có ghi chú'}</td>
                    <td>
                      {hall.AnhURL ? <img src={hall.AnhURL} alt={hall.TenSanh} className="hall-thumbnail" /> : <span style={{color: '#999', fontSize: '12px'}}>Chưa có hình</span>}
                    </td>
                    <td className="text-right">
                      <div className="action-cells" style={{justifyContent: 'flex-end'}}>
                          <button className="icon-btn edit-btn" title="Sửa" onClick={() => handleEditSanh(hall)}><FaEdit /></button>
                          <button className="icon-btn delete-btn" title="Xóa" onClick={() => handleDeleteSanh(hall.MaSanh)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* --- PHẦN 3: QUẢN LÝ LOẠI SẢNH (Đã sửa căn lề giống bảng trên) --- */}
        <section className="section-block">
            <div className="section-header-row">
                <h2 className="section-title">Quản lý loại sảnh</h2>
                
                <div className="controls-group">
                    <div className="search-box">
                        <input type="text" placeholder="Tìm loại sảnh..." value={searchLoaiSanh} onChange={(e) => setSearchLoaiSanh(e.target.value)} />
                        <FaSearch className="search-icon" />
                    </div>
                    <button className="add-btn" onClick={handleAddLoaiSanh}>Thêm loại sảnh</button>
                </div>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th style={{width: '15%'}}>Loại</th>
                        <th style={{width: '25%'}}>Mô tả</th>
                        <th style={{width: '15%'}}>Giá</th>
                        <th style={{width: '30%'}}>Ghi chú</th>
                        {/* Căn phải tiêu đề cột Chỉnh sửa */}
                        <th style={{width: '15%'}} className="text-right">Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredHallTypes.length === 0 ? (
                      <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Không có dữ liệu</td></tr>
                    ) : (
                      filteredHallTypes.map((type) => (
                        <tr key={type.MaLoaiSanh}>
                            <td style={{fontWeight: 'bold', color: '#333'}}>{type.TenLoaiSanh}</td>
                            <td style={{fontSize: '14px', color: '#555'}}>Loại sảnh tiêu chuẩn</td>
                            <td style={{fontWeight: 'bold', color: '#8A7CDF'}}>{type.DonGiaBanToiThieu ? `${parseInt(type.DonGiaBanToiThieu).toLocaleString()} VND` : 'N/A'}</td>
                            <td style={{fontSize: '13px', color: '#777', fontStyle: 'italic'}}>Giá theo bàn</td>
                            <td className="text-right">
                                <div className="action-cells" style={{justifyContent: 'flex-end'}}>
                                    <button className="icon-btn edit-btn" title="Sửa" onClick={() => handleEditLoaiSanh(type)}><FaEdit /></button>
                                    <button className="icon-btn delete-btn" title="Xóa" onClick={() => handleDeleteLoaiSanh(type.MaLoaiSanh)}><FaTrash /></button>
                                </div>
                            </td>
                        </tr>
                      ))
                    )}
                </tbody>
            </table>
        </section>

      </div>

      {/* Modals */}
      {showCaModal && <CaModal ca={editingCa} onClose={() => setShowCaModal(false)} onSave={handleSaveCa} />}
      {showSanhModal && <SanhModal sanh={editingSanh} loaiSanhOptions={hallTypes} onClose={() => setShowSanhModal(false)} onSave={handleSaveSanh} />}
      {showLoaiSanhModal && <LoaiSanhModal loaiSanh={editingLoaiSanh} onClose={() => setShowLoaiSanhModal(false)} onSave={handleSaveLoaiSanh} />}
    </div>
  );
};

// Modal Components
const CaModal = ({ ca, onClose, onSave }) => {
  const [formData, setFormData] = useState({ tenCa: ca?.TenCa || '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenCa) { alert('Vui lòng nhập tên ca'); return; }
    onSave(formData);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{ca ? 'Chỉnh sửa ca' : 'Thêm ca mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên ca <span style={{color: 'red'}}>*</span></label>
            <input type="text" value={formData.tenCa} onChange={(e) => setFormData({...formData, tenCa: e.target.value})} placeholder="Ví dụ: Ca sáng, Ca trưa, Ca chiều, Ca tối..." />
          </div>
          <div className="modal-actions"><button type="button" className="btn-cancel" onClick={onClose}>Hủy</button><button type="submit" className="btn-save">Lưu</button></div>
        </form>
      </div>
    </div>
  );
};

const SanhModal = ({ sanh, loaiSanhOptions, onClose, onSave }) => {
  const [formData, setFormData] = useState({ tenSanh: sanh?.TenSanh || '', maLoaiSanh: sanh?.MaLoaiSanh || (loaiSanhOptions[0]?.MaLoaiSanh || ''), soLuongBanToiDa: sanh?.SoLuongBanToiDa || '', ghiChu: sanh?.GhiChu || '', anhURL: sanh?.AnhURL || '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenSanh || !formData.maLoaiSanh || !formData.soLuongBanToiDa) { alert('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    onSave(formData);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{sanh ? 'Chỉnh sửa sảnh' : 'Thêm sảnh mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Tên sảnh <span style={{color: 'red'}}>*</span></label><input type="text" value={formData.tenSanh} onChange={(e) => setFormData({...formData, tenSanh: e.target.value})} placeholder="Ví dụ: Sảnh Ngọc Lan..." /></div>
          <div className="form-group"><label>Loại sảnh <span style={{color: 'red'}}>*</span></label><select value={formData.maLoaiSanh} onChange={(e) => setFormData({...formData, maLoaiSanh: parseInt(e.target.value)})}>{loaiSanhOptions.map(loai => <option key={loai.MaLoaiSanh} value={loai.MaLoaiSanh}>{loai.TenLoaiSanh}</option>)}</select></div>
          <div className="form-group"><label>Số lượng bàn tối đa <span style={{color: 'red'}}>*</span></label><input type="number" value={formData.soLuongBanToiDa} onChange={(e) => setFormData({...formData, soLuongBanToiDa: parseInt(e.target.value)})} placeholder="Ví dụ: 50" min="1" /></div>
          <div className="form-group"><label>Ghi chú</label><textarea value={formData.ghiChu} onChange={(e) => setFormData({...formData, ghiChu: e.target.value})} placeholder="Ghi chú về sảnh..." rows="3" /></div>
          <div className="form-group"><label>Ảnh URL</label><input type="text" value={formData.anhURL} onChange={(e) => setFormData({...formData, anhURL: e.target.value})} placeholder="https://example.com/image.jpg" /></div>
          <div className="modal-actions"><button type="button" className="btn-cancel" onClick={onClose}>Hủy</button><button type="submit" className="btn-save">Lưu</button></div>
        </form>
      </div>
    </div>
  );
};

const LoaiSanhModal = ({ loaiSanh, onClose, onSave }) => {
  const [formData, setFormData] = useState({ tenLoaiSanh: loaiSanh?.TenLoaiSanh || '', donGiaBanToiThieu: loaiSanh?.DonGiaBanToiThieu || '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenLoaiSanh || !formData.donGiaBanToiThieu) { alert('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    onSave(formData);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{loaiSanh ? 'Chỉnh sửa loại sảnh' : 'Thêm loại sảnh mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên loại sảnh <span style={{color: 'red'}}>*</span></label>
            <input type="text" value={formData.tenLoaiSanh} onChange={(e) => setFormData({...formData, tenLoaiSanh: e.target.value})} placeholder="Ví dụ: Sảnh A, Sảnh VIP..." />
          </div>
          <div className="form-group">
            <label>Đơn giá bàn tối thiểu <span style={{color: 'red'}}>*</span></label>
            <input type="number" value={formData.donGiaBanToiThieu} onChange={(e) => setFormData({...formData, donGiaBanToiThieu: parseFloat(e.target.value)})} placeholder="Ví dụ: 3000000" min="0" step="10000" />
          </div>
          <div className="modal-actions"><button type="button" className="btn-cancel" onClick={onClose}>Hủy</button><button type="submit" className="btn-save">Lưu</button></div>
        </form>
      </div>
    </div>
  );
};

export default ManagementPage;