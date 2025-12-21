// Auth Utils - Quản lý authentication tokens

export const authUtils = {
  // Lưu tokens sau khi login
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Lấy access token
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Lấy refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // Lưu thông tin user
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Lấy thông tin user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Xóa tất cả thông tin khi logout
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Kiểm tra user có role Admin không
  isAdmin: () => {
    const user = authUtils.getUser();
    return user && user.maNhom === 1;
  },

  // Lấy role của user
  getUserRole: () => {
    const user = authUtils.getUser();
    return user ? user.maNhom : null;
  },
};

export default authUtils;
