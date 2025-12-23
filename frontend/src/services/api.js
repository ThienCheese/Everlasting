// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers when token is refreshed
const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

// Helper function to handle API requests with auto token refresh
const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // Add authorization header if not present
  if (!options.headers) {
    options.headers = {};
  }
  if (accessToken && !options.headers['Authorization']) {
    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, options);

  // If 401 Unauthorized, try to refresh token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      // No refresh token, redirect to login
      localStorage.clear();
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('auth:token-expired', {
        detail: { message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }
      }));
      
      // Also redirect directly as fallback
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    // If already refreshing, wait for it to complete
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newAccessToken) => {
          options.headers['Authorization'] = `Bearer ${newAccessToken}`;
          resolve(fetch(url, options));
        });
      });
    }

    isRefreshing = true;

    try {
      // Try to refresh the token
      const refreshResponse = await fetch(`${API_BASE_URL}/nguoidung/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        // Refresh token also expired, redirect to login
        localStorage.clear();
        
        // Dispatch event for AuthErrorHandler to catch
        window.dispatchEvent(new CustomEvent('auth:token-expired', {
          detail: { message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }
        }));
        
        // Also redirect directly as fallback
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      // Save new tokens
      const newAccessToken = refreshData.data.accessToken;
      const newRefreshToken = refreshData.data.refreshToken;
      
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      // Notify all waiting requests
      onTokenRefreshed(newAccessToken);
      isRefreshing = false;

      // Retry original request with new token
      options.headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(url, options);
    } catch (error) {
      isRefreshing = false;
      refreshSubscribers = [];
      throw error;
    }
  }

  return response;
};

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

  // Refresh token (manual call if needed)
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
    const response = await fetchWithAuth(`${API_BASE_URL}/nguoidung/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetchWithAuth(`${API_BASE_URL}/nguoidung/me`, {
      method: 'GET',
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
    const response = await fetchWithAuth(`${API_BASE_URL}/nguoidung/all`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách người dùng thất bại');
    }

    return data;
  },

  // Update user (Admin or self)
  updateUser: async (userId, userData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/nguoidung/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetchWithAuth(`${API_BASE_URL}/nguoidung/delete/${userId}`, {
      method: 'DELETE',
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
    const response = await fetchWithAuth(`${API_BASE_URL}/phanquyen/lists`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy ma trận phân quyền thất bại');
    }

    return data;
  },

  // Update permissions for a role (bulk update)
  updateRolePermissions: async (maNhom, danhSachChucNang) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/phanquyen/nhom/${maNhom}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ danhSachChucNang }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật phân quyền thất bại');
    }

    return data;
  },

  // ========== CA (SHIFTS) MANAGEMENT ==========
  
  // Get all shifts
  getCa: async () => {
    const response = await fetch(`${API_BASE_URL}/ca/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách ca thất bại');
    }

    return data;
  },

  // Get shift by ID
  getCaById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ca/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy chi tiết ca thất bại');
    }

    return data;
  },

  // Create new shift (Admin only)
  createCa: async (caData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/ca/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tạo ca thất bại');
    }

    return data;
  },

  // Update shift (Admin only)
  updateCa: async (id, caData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/ca/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật ca thất bại');
    }

    return data;
  },

  // Delete shift (Admin only)
  deleteCa: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/ca/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xóa ca thất bại');
    }

    return data;
  },

  // ========== SANH (HALLS) MANAGEMENT ==========
  
  // Get all halls
  getSanh: async () => {
    const response = await fetch(`${API_BASE_URL}/sanh/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách sảnh thất bại');
    }

    return data;
  },

  // Get hall by ID
  getSanhById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sanh/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy chi tiết sảnh thất bại');
    }

    return data;
  },

  // Create new hall (Admin only)
  createSanh: async (sanhData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/sanh/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanhData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tạo sảnh thất bại');
    }

    return data;
  },

  // Update hall (Admin only)
  updateSanh: async (id, sanhData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/sanh/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanhData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật sảnh thất bại');
    }

    return data;
  },

  // Delete hall (Admin only)
  deleteSanh: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/sanh/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xóa sảnh thất bại');
    }

    return data;
  },

  // ========== LOAI SANH (HALL TYPES) MANAGEMENT ==========
  
  // Get all hall types
  getLoaiSanh: async () => {
    const response = await fetch(`${API_BASE_URL}/loaisanh/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách loại sảnh thất bại');
    }

    return data;
  },

  // Get hall type by ID
  getLoaiSanhById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/loaisanh/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy chi tiết loại sảnh thất bại');
    }

    return data;
  },

  // Create new hall type (Admin only)
  createLoaiSanh: async (loaiSanhData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/loaisanh/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loaiSanhData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tạo loại sảnh thất bại');
    }

    return data;
  },

  // Update hall type (Admin only)
  updateLoaiSanh: async (id, loaiSanhData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/loaisanh/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loaiSanhData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật loại sảnh thất bại');
    }

    return data;
  },

  // Delete hall type (Admin only)
  deleteLoaiSanh: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/loaisanh/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xóa loại sảnh thất bại');
    }

    return data;
  },

  // ==================== MÓN ĂN (MONAN) ====================
  
  // Get all dishes
  getAllMonAn: async () => {
    const response = await fetch(`${API_BASE_URL}/monan/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách món ăn thất bại');
    }

    return data;
  },

  // Get dish by ID
  getMonAnById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/monan/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy chi tiết món ăn thất bại');
    }

    return data;
  },

  // Create new dish
  createMonAn: async (monAnData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/monan/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monAnData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tạo món ăn thất bại');
    }

    return data;
  },

  // Update dish
  updateMonAn: async (id, monAnData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/monan/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monAnData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật món ăn thất bại');
    }

    return data;
  },

  // Delete dish
  deleteMonAn: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/monan/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xóa món ăn thất bại');
    }

    return data;
  },

  // ==================== THỰC ĐƠN MẪU (THUCDONMAU) ====================
  
  // Get all set menus
  getAllThucDonMau: async () => {
    const response = await fetch(`${API_BASE_URL}/thucdonmau/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách thực đơn mẫu thất bại');
    }

    return data;
  },

  // Get set menu by ID
  getThucDonMauById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/thucdonmau/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy chi tiết thực đơn mẫu thất bại');
    }

    return data;
  },

  // Create new set menu
  createThucDonMau: async (thucDonMauData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/thucdonmau/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thucDonMauData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tạo thực đơn mẫu thất bại');
    }

    return data;
  },

  // Update set menu
  updateThucDonMau: async (id, thucDonMauData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/thucdonmau/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thucDonMauData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật thực đơn mẫu thất bại');
    }

    return data;
  },

  // Delete set menu
  deleteThucDonMau: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/thucdonmau/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xóa thực đơn mẫu thất bại');
    }

    return data;
  },

  // ==================== LOẠI MÓN ĂN (LOAIMONAN) ====================
  
  // Get all dish categories
  getAllLoaiMonAn: async () => {
    const response = await fetch(`${API_BASE_URL}/loaimonan/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách loại món ăn thất bại');
    }

    return data;
  },

  // Get dish category by ID
  getLoaiMonAnById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/loaimonan/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy chi tiết loại món ăn thất bại');
    }

    return data;
  },

  // Create new dish category
  createLoaiMonAn: async (loaiMonAnData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/loaimonan/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loaiMonAnData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tạo loại món ăn thất bại');
    }

    return data;
  },

  // Update dish category
  updateLoaiMonAn: async (id, loaiMonAnData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/loaimonan/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loaiMonAnData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật loại món ăn thất bại');
    }

    return data;
  },

  // Delete dish category
  deleteLoaiMonAn: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/loaimonan/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xóa loại món ăn thất bại');
    }

    return data;
  },

  // ==================== DỊCH VỤ APIs ====================
  
  getAllDichVu: async () => {
    const response = await fetch(`${API_BASE_URL}/dichvu/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách dịch vụ thất bại');
    }

    return data;
  },

  getDichVuById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/dichvu/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy thông tin dịch vụ thất bại');
    }

    return data;
  },

  createDichVu: async (dichvuData) => {
    return await fetchWithAuth(`${API_BASE_URL}/dichvu/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dichvuData)
    });
  },

  updateDichVu: async (id, dichvuData) => {
    return await fetchWithAuth(`${API_BASE_URL}/dichvu/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dichvuData)
    });
  },

  deleteDichVu: async (id) => {
    return await fetchWithAuth(`${API_BASE_URL}/dichvu/delete/${id}`, {
      method: 'DELETE'
    });
  },

  // ==================== LOẠI DỊCH VỤ APIs ====================
  
  getAllLoaiDichVu: async () => {
    const response = await fetch(`${API_BASE_URL}/loaidichvu/lists`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy danh sách loại dịch vụ thất bại');
    }

    return data;
  },

  getLoaiDichVuById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/loaidichvu/details/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy thông tin loại dịch vụ thất bại');
    }

    return data;
  },

  createLoaiDichVu: async (loaiData) => {
    return await fetchWithAuth(`${API_BASE_URL}/loaidichvu/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loaiData)
    });
  },

  updateLoaiDichVu: async (id, loaiData) => {
    return await fetchWithAuth(`${API_BASE_URL}/loaidichvu/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loaiData)
    });
  },

  deleteLoaiDichVu: async (id) => {
    return await fetchWithAuth(`${API_BASE_URL}/loaidichvu/delete/${id}`, {
      method: 'DELETE'
    });
  },
};

export default apiService;
