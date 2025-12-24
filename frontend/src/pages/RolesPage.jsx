import React, { useState, useEffect } from 'react';
import './RolesPage.css';
import { 
    FaUserShield, FaSave, FaSearch, 
    FaTrashAlt, FaCheck, FaTimes, FaLayerGroup, FaPlus 
} from "react-icons/fa";
import apiService from '../services/api';

const RolesPage = () => {
  const [activeTab, setActiveTab] = useState('users'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- DỮ LIỆU TỪ DATABASE ---
  const [users, setUsers] = useState([]);

  // Hardcode roles và permissions
  const roles = [
    { id: 1, name: "Admin", displayName: "Admin" },
    { id: 2, name: "Lễ tân", displayName: "Lễ tân" },
    { id: 3, name: "Quản lý", displayName: "Quản lý" },
    { id: 4, name: "Bếp trưởng", displayName: "Bếp trưởng" },
    { id: 5, name: "Kế toán", displayName: "Kế toán" },
    { id: 6, name: "Guest", displayName: "Guest" },
  ];

  // Hardcode permission matrix (read-only)
  const permissionMatrix = [
    {
      name: "Quản lý người dùng",
      permissions: {
        1: true,  // Admin
        2: false, // Lễ tân
        3: false, // Quản lý
        4: false, // Bếp trưởng
        5: false, // Kế toán
        6: false  // Guest
      }
    },
    {
      name: "Quản lý sảnh",
      permissions: {
        1: true,  // Admin
        2: true,  // Lễ tân
        3: true,  // Quản lý
        4: false, // Bếp trưởng
        5: false, // Kế toán
        6: false  // Guest
      }
    },
    {
      name: "Quản lý món ăn",
      permissions: {
        1: true,  // Admin
        2: false, // Lễ tân
        3: true,  // Quản lý
        4: true,  // Bếp trưởng
        5: false, // Kế toán
        6: false  // Guest
      }
    },
    {
      name: "Quản lý dịch vụ",
      permissions: {
        1: true,  // Admin
        2: false, // Lễ tân
        3: true,  // Quản lý
        4: false, // Bếp trưởng
        5: false, // Kế toán
        6: false  // Guest
      }
    },
    {
      name: "Quản lý đặt tiệc",
      permissions: {
        1: true,  // Admin
        2: true,  // Lễ tân
        3: false, // Quản lý
        4: true,  // Bếp trưởng
        5: true,  // Kế toán
        6: false  // Guest
      }
    },
    {
      name: "Public endpoints",
      permissions: {
        1: true,  // Admin
        2: true,  // Lễ tân
        3: true,  // Quản lý
        4: true,  // Bếp trưởng
        5: true,  // Kế toán
        6: true   // Guest
      }
    }
  ];

  // Track changes
  const [hasChanges, setHasChanges] = useState(false);
  const [changedUsers, setChangedUsers] = useState(new Set());

  // --- STATE CHO MODAL THÊM USER ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    fullname: '',
    password: '123456', // Mật khẩu mặc định
    roleId: 2 
  });

  // --- LOAD DATA TỪ API ---
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAllUsers();
      
      console.log('Users response:', response);

      if (response.status === 'success' && response.data) {
        setUsers(response.data);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ ---
  
  // Handle role change for user
  const handleRoleChange = (userId, newRoleId) => {
    setUsers(users.map(u => 
      u.MaNguoiDung === userId ? { ...u, MaNhom: parseInt(newRoleId) } : u
    ));
    setChangedUsers(prev => new Set(prev).add(userId));
    setHasChanges(true);
  };

  // Handle add new user
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.fullname) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setSaving(true);
      
      // Register new user
      const response = await apiService.register(
        newUser.username,
        newUser.password,
        newUser.fullname
      );

      if (response.success) {
        // Update role if not Guest
        if (newUser.roleId !== 6) {
          await apiService.updateUser(response.data.MaNguoiDung, {
            maNhom: parseInt(newUser.roleId)
          });
        }

        // Reload users
        await loadUsers();
        
        setShowAddModal(false);
        setNewUser({ username: '', fullname: '', password: '123456', roleId: 2 });
        alert('Thêm người dùng thành công!');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      alert(err.message || 'Thêm người dùng thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await apiService.deleteUser(userId);
      
      if (response.success) {
        setUsers(users.filter(u => u.MaNguoiDung !== userId));
        alert('Xóa người dùng thành công!');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.message || 'Xóa người dùng thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Save changes (only user role updates)
  const handleSaveChanges = async () => {
    if (!hasChanges) {
      alert('Không có thay đổi nào để lưu');
      return;
    }

    if (!confirm('Bạn có chắc muốn lưu tất cả thay đổi?')) {
      return;
    }

    setSaving(true);
    
    try {
      // Update changed users
      for (const userId of changedUsers) {
        const user = users.find(u => u.MaNguoiDung === userId);
        if (user) {
          await apiService.updateUser(userId, { maNhom: user.MaNhom });
        }
      }

      setHasChanges(false);
      setChangedUsers(new Set());
      alert('Lưu thay đổi thành công!');
      
      // Reload data to ensure consistency
      await loadUsers();
      
    } catch (err) {
      console.error('Error saving changes:', err);
      alert(err.message || 'Lưu thay đổi thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter(user => 
    user.TenDangNhap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.TenNguoiDung?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="roles-page-wrapper">
        <div className="content-body" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roles-page-wrapper">
        <div className="content-body" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>Lỗi: {error}</p>
          <button onClick={loadUsers}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="roles-page-wrapper">
      <div className="content-body">
        
        {/* HEADER */}
        <div className="roles-header">
            <div className="header-text">
                <h2>Phân Quyền Hệ Thống</h2>
                <p>Quản lý người dùng và thiết lập quyền truy cập chức năng.</p>
            </div>
            <button 
              className="btn-save" 
              onClick={handleSaveChanges}
              disabled={!hasChanges || saving}
            >
                <FaSave /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </div>

        {/* TABS */}
        <div className="role-tabs">
            <button 
                className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
            >
                <FaUserShield /> Danh sách người dùng
            </button>
            <button 
                className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('permissions')}
            >
                <FaLayerGroup /> Ma trận phân quyền
            </button>
        </div>

        {/* --- TAB 1: DANH SÁCH USER --- */}
        {activeTab === 'users' && (
            <div className="role-card fade-in">
                <div className="table-controls">
                    <div className="search-box-simple">
                        <FaSearch className="icon-search"/>
                        <input 
                          type="text" 
                          placeholder="Tìm người dùng..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-add-user" onClick={() => setShowAddModal(true)}>
                        <FaPlus /> Thêm người dùng
                    </button>
                </div>
                
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên đăng nhập</th>
                            <th>Họ và tên</th>
                            <th>Nhóm quyền</th>
                            <th className="text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                              Không tìm thấy người dùng
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map(user => (
                            <tr key={user.MaNguoiDung}>
                                <td>#{user.MaNguoiDung}</td>
                                <td className="font-bold">{user.TenDangNhap}</td>
                                <td>{user.TenNguoiDung}</td>
                                <td>
                                    <select 
                                        className="role-select"
                                        value={user.MaNhom}
                                        onChange={(e) => handleRoleChange(user.MaNguoiDung, e.target.value)}
                                    >
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.displayName}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="text-right">
                                    <button 
                                      className="icon-btn-small delete" 
                                      onClick={() => handleDeleteUser(user.MaNguoiDung)}
                                      disabled={saving}
                                    >
                                      <FaTrashAlt/>
                                    </button>
                                </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                </table>
            </div>
        )}

        {/* --- TAB 2: MA TRẬN PHÂN QUYỀN --- */}
        {activeTab === 'permissions' && (
            <div className="role-card fade-in">
                <div className="info-banner" style={{
                  backgroundColor: '#e3f2fd',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  color: '#1976d2',
                  fontSize: '14px'
                }}>
                  ℹ️ Bảng phân quyền này chỉ để xem. Liên hệ Admin nếu cần thay đổi quyền.
                </div>
                
                <div className="matrix-wrapper">
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="sticky-col">Chức năng / Module</th>
                                {roles.map(role => (
                                    <th key={role.id}>{role.displayName}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissionMatrix.map((perm, index) => (
                                <tr key={index}>
                                    <td className="sticky-col font-medium">{perm.name}</td>
                                    {roles.map(role => {
                                        const hasPermission = perm.permissions[role.id];
                                        
                                        return (
                                          <td key={role.id} style={{ textAlign: 'center' }}>
                                              {hasPermission ? (
                                                <FaCheck style={{ color: '#4caf50', fontSize: '18px' }} />
                                              ) : (
                                                <FaTimes style={{ color: '#f44336', fontSize: '18px' }} />
                                              )}
                                          </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="note-text">*Bảng phân quyền được cấu hình sẵn trong hệ thống.</p>
            </div>
        )}

        {/* MODAL THÊM USER (POPUP) */}
        {showAddModal && (
            <div className="modal-overlay">
                <div className="modal-content fade-in">
                    <h3>Thêm Người Dùng Mới</h3>
                    <div className="modal-form">
                        <div className="form-group">
                            <label>Tên đăng nhập *</label>
                            <input 
                                type="text" 
                                placeholder="Ví dụ: nhanvien1"
                                value={newUser.username}
                                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                disabled={saving}
                            />
                        </div>
                        <div className="form-group">
                            <label>Họ và tên *</label>
                            <input 
                                type="text" 
                                placeholder="Ví dụ: Nguyễn Văn A"
                                value={newUser.fullname}
                                onChange={(e) => setNewUser({...newUser, fullname: e.target.value})}
                                disabled={saving}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu mặc định</label>
                            <input 
                              type="password" 
                              value={newUser.password} 
                              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                              className="input-disabled"
                              disabled={saving}
                            />
                            <small>User sẽ đăng nhập bằng mật khẩu này</small>
                        </div>
                        <div className="form-group">
                            <label>Nhóm quyền *</label>
                            <select 
                                value={newUser.roleId}
                                onChange={(e) => setNewUser({...newUser, roleId: e.target.value})}
                                disabled={saving}
                            >
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.displayName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button 
                          className="btn-cancel" 
                          onClick={() => setShowAddModal(false)}
                          disabled={saving}
                        >
                          Hủy bỏ
                        </button>
                        <button 
                          className="btn-submit" 
                          onClick={handleAddUser}
                          disabled={saving}
                        >
                          {saving ? 'Đang thêm...' : 'Xác nhận thêm'}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default RolesPage;