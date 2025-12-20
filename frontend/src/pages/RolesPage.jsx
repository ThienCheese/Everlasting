import React, { useState } from 'react';
import './RolesPage.css';
import { 
    FaUserShield, FaSave, FaSearch, FaEdit, 
    FaTrashAlt, FaCheck, FaLayerGroup, FaPlus 
} from "react-icons/fa"; // 1. Import thêm FaPlus

const RolesPage = () => {
  const [activeTab, setActiveTab] = useState('users'); 

  // --- DỮ LIỆU ---
  const roles = [
    { id: 1, name: "Quản trị viên (Admin)", code: "ADMIN" },
    { id: 2, name: "Đầu bếp", code: "CHEF" },
    { id: 3, name: "Dịch vụ", code: "SERVICE" },
    { id: 4, name: "Lễ tân", code: "RECEPTION" },
    { id: 5, name: "Kế toán", code: "ACCOUNTANT" },
  ];

  const [users, setUsers] = useState([
    { id: 1, username: 'admin', fullname: 'Quản trị viên hệ thống', roleId: 1, status: true },
    { id: 2, username: 'daubep1', fullname: 'Đầu bếp 1', roleId: 2, status: true },
    { id: 3, username: 'dichvu1', fullname: 'Nhân viên Dịch vụ 1', roleId: 3, status: true },
    { id: 4, username: 'letan1', fullname: 'Lễ tân 1', roleId: 4, status: true },
    { id: 5, username: 'ketoan1', fullname: 'Kế toán 1', roleId: 5, status: true },
  ]);

  const [permissions, setPermissions] = useState([
    { module: "Quản lý Sảnh", actions: { 1: true, 2: false, 3: false, 4: true, 5: false } },
    { module: "Quản lý Thực đơn", actions: { 1: true, 2: true, 3: false, 4: true, 5: false } },
    { module: "Đặt tiệc (Booking)", actions: { 1: true, 2: false, 3: false, 4: true, 5: true } },
    { module: "Thống kê & Báo cáo", actions: { 1: true, 2: false, 3: false, 4: false, 5: true } },
    { module: "Phân quyền hệ thống", actions: { 1: true, 2: false, 3: false, 4: false, 5: false } },
  ]);

  // --- 2. STATE CHO MODAL THÊM USER ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    fullname: '',
    roleId: 2 // Mặc định là Đầu bếp hoặc role thấp nhất
  });

  // --- HÀM XỬ LÝ ---
  const handleRoleChange = (userId, newRoleId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, roleId: parseInt(newRoleId) } : u));
  };

  const togglePermission = (moduleIndex, roleId) => {
    const newPerms = [...permissions];
    newPerms[moduleIndex].actions[roleId] = !newPerms[moduleIndex].actions[roleId];
    setPermissions(newPerms);
  };

  // 3. Hàm thêm user mới
  const handleAddUser = () => {
    if (!newUser.username || !newUser.fullname) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const userToAdd = {
        id: newId,
        username: newUser.username,
        fullname: newUser.fullname,
        roleId: parseInt(newUser.roleId),
        status: true
    };

    setUsers([...users, userToAdd]);
    setShowAddModal(false); // Đóng modal
    setNewUser({ username: '', fullname: '', roleId: 2 }); // Reset form
  };

  return (
    <div className="roles-page-wrapper">
      <div className="content-body">
        
        {/* HEADER */}
        <div className="roles-header">
            <div className="header-text">
                <h2>Phân Quyền Hệ Thống</h2>
                <p>Quản lý người dùng và thiết lập quyền truy cập chức năng.</p>
            </div>
            <button className="btn-save">
                <FaSave /> Lưu thay đổi
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
                        <input type="text" placeholder="Tìm người dùng..." />
                    </div>
                    {/* 4. Nút Thêm mới */}
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
                            <th>Trạng thái</th>
                            <th className="text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>#{user.id}</td>
                                <td className="font-bold">{user.username}</td>
                                <td>{user.fullname}</td>
                                <td>
                                    <select 
                                        className="role-select"
                                        value={user.roleId}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.status ? 'active' : 'inactive'}`}>
                                        {user.status ? 'Hoạt động' : 'Đã khóa'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button className="icon-btn-small edit"><FaEdit/></button>
                                    <button className="icon-btn-small delete"><FaTrashAlt/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* --- TAB 2: MA TRẬN PHÂN QUYỀN --- */}
        {activeTab === 'permissions' && (
            <div className="role-card fade-in">
                <div className="matrix-wrapper">
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="sticky-col">Chức năng / Module</th>
                                {roles.map(role => (
                                    <th key={role.id}>{role.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm, index) => (
                                <tr key={index}>
                                    <td className="sticky-col font-medium">{perm.module}</td>
                                    {roles.map(role => (
                                        <td key={role.id}>
                                            <label className="checkbox-container">
                                                <input 
                                                    type="checkbox" 
                                                    checked={perm.actions[role.id]} 
                                                    onChange={() => togglePermission(index, role.id)}
                                                />
                                                <span className="checkmark">
                                                    {perm.actions[role.id] && <FaCheck className="check-icon"/>}
                                                </span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="note-text">*Đánh dấu vào ô để cấp quyền truy cập cho nhóm tương ứng.</p>
            </div>
        )}

        {/* 5. MODAL THÊM USER (POPUP) */}
        {showAddModal && (
            <div className="modal-overlay">
                <div className="modal-content fade-in">
                    <h3>Thêm Người Dùng Mới</h3>
                    <div className="modal-form">
                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <input 
                                type="text" 
                                placeholder="Ví dụ: nhanvien1"
                                value={newUser.username}
                                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input 
                                type="text" 
                                placeholder="Ví dụ: Nguyễn Văn A"
                                value={newUser.fullname}
                                onChange={(e) => setNewUser({...newUser, fullname: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu (Mặc định)</label>
                            <input type="password" value="123456" disabled className="input-disabled"/>
                            <small>Mật khẩu mặc định là: 123456</small>
                        </div>
                        <div className="form-group">
                            <label>Nhóm quyền</label>
                            <select 
                                value={newUser.roleId}
                                onChange={(e) => setNewUser({...newUser, roleId: e.target.value})}
                            >
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy bỏ</button>
                        <button className="btn-submit" onClick={handleAddUser}>Xác nhận thêm</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default RolesPage;