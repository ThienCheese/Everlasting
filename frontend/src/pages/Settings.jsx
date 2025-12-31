import React, { useState, useEffect } from 'react';
import './Settings.css';
import apiService from '../services/api';
import { FaSave, FaCog } from 'react-icons/fa';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thamSo, setThamSo] = useState(null);
  const [formData, setFormData] = useState({
    phanTramPhatTrenNgay: '',
    phanTramCoc: ''
  });

  useEffect(() => {
    loadThamSo();
  }, []);

  const loadThamSo = async () => {
    try {
      setLoading(true);
      const response = await apiService.getThamSo();
      setThamSo(response.data);
      setFormData({
        phanTramPhatTrenNgay: response.data.PhanTramPhatTrenNgay || 0,
        phanTramCoc: response.data.PhanTramCoc || 0
      });
    } catch (err) {
      alert('Lỗi khi tải tham số: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate
      if (formData.phanTramPhatTrenNgay < 0 || formData.phanTramPhatTrenNgay > 100) {
        alert('Phần trăm phạt phải từ 0-100');
        return;
      }
      if (formData.phanTramCoc < 0 || formData.phanTramCoc > 100) {
        alert('Phần trăm cọc phải từ 0-100');
        return;
      }

      setSaving(true);
      await apiService.updateThamSo({
        phanTramPhatTrenNgay: parseFloat(formData.phanTramPhatTrenNgay),
        phanTramCoc: parseFloat(formData.phanTramCoc)
      });
      alert('Cập nhật tham số thành công!');
      await loadThamSo();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="settings-container"><div className="loading">Đang tải...</div></div>;
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <FaCog className="settings-icon" />
        <h1>Cài đặt hệ thống</h1>
      </div>

      <div className="settings-card">
        <h2>Tham số vận hành</h2>
        <p className="settings-description">
          Các tham số này áp dụng cho toàn bộ hệ thống và ảnh hưởng đến tính toán hóa đơn.
        </p>

        <div className="settings-form">
          <div className="form-group">
            <label>
              Phần trăm phạt trễ mỗi ngày (%)
              <span className="hint">Áp dụng khi thanh toán sau ngày đãi tiệc</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.phanTramPhatTrenNgay}
              onChange={(e) => setFormData({...formData, phanTramPhatTrenNgay: e.target.value})}
              placeholder="Ví dụ: 5.00"
            />
            <small className="form-text">
              Hiện tại: {thamSo?.PhanTramPhatTrenNgay}% mỗi ngày trễ hạn
            </small>
          </div>

          <div className="form-group">
            <label>
              Phần trăm tiền đặt cọc (%)
              <span className="hint">Tỷ lệ đặt cọc tối thiểu cho mỗi đặt tiệc</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.phanTramCoc}
              onChange={(e) => setFormData({...formData, phanTramCoc: e.target.value})}
              placeholder="Ví dụ: 30.00"
            />
            <small className="form-text">
              Hiện tại: {thamSo?.PhanTramCoc}% giá trị đặt tiệc
            </small>
          </div>

          <div className="form-actions">
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={saving}
            >
              <FaSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        <div className="settings-info">
          <h3>Thông tin</h3>
          <ul>
            <li><strong>Phạt trễ:</strong> Được tính theo công thức: Tổng tiền hóa đơn × Phần trăm phạt × Số ngày trễ</li>
            <li><strong>Đặt cọc:</strong> Khách hàng phải đặt cọc tối thiểu theo phần trăm này khi đặt tiệc</li>
            <li><strong>Chỉ Admin:</strong> Chỉ tài khoản quản trị viên mới có quyền thay đổi các tham số này</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
