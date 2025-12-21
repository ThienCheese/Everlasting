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
};

export default apiService;
