// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Service
const apiService = {
  // Login
  login: async (tenDangNhap, matKhau) => {
    const response = await fetch(`${API_BASE_URL}/nguoidung/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tenDangNhap, matKhau }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }

    return data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/nguoidung/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Làm mới token thất bại');
    }

    return data;
  },

  // Logout
  logout: async (refreshToken) => {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/nguoidung/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đăng xuất thất bại');
    }

    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/nguoidung/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy thông tin user thất bại');
    }

    return data;
  },

  // Register
  register: async (tenDangNhap, matKhau, tenNguoiDung) => {
    const response = await fetch(`${API_BASE_URL}/nguoidung/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tenDangNhap, matKhau, tenNguoiDung }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đăng ký thất bại');
    }

    return data;
  },

  // ========== USER MANAGEMENT ==========
  
  // Get all users (Admin only)
  getAllUsers: async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/nguoidung/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách người dùng thất bại');
    }

    return data;
  },

  // Update user (Admin or self)
  updateUser: async (userId, userData) => {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/nguoidung/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật người dùng thất bại');
    }

    return data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/nguoidung/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xóa người dùng thất bại');
    }

    return data;
  },

  // ========== ROLE & PERMISSION MANAGEMENT ==========
  
  // Get all roles (from system constants)
  getRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/system/roles`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách nhóm quyền thất bại');
    }

    return data;
  },

  // Get all permissions
  getPermissions: async () => {
    const response = await fetch(`${API_BASE_URL}/system/permissions`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách chức năng thất bại');
    }

    return data;
  },

  // Get permission matrix
  getPermissionMatrix: async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/phanquyen/lists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy ma trận phân quyền thất bại');
    }

    return data;
  },

  // Update permissions for a role (bulk update)
  updateRolePermissions: async (maNhom, danhSachChucNang) => {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/phanquyen/nhom/${maNhom}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ danhSachChucNang }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật phân quyền thất bại');
    }

    return data;
  },
};

export default apiService;
