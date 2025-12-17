import User from '../models/users.model.js';
import RefreshToken from '../models/refreshtoken.model.js';
import logger from '../helpers/logger.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  validateRegister,
  validateLogin,
} from '../services/auth.services.js';

// Register
export const register = async (req, res) => {
  logger.info('[REGISTER] Register request received');
  try {
    const { tenDangNhap, matKhau, tenNguoiDung, maNhom } = req.body;

    // Validate
    await validateRegister(tenDangNhap, matKhau, tenNguoiDung, maNhom);

    // Hash password
    const hashedPassword = await hashPassword(matKhau);

    // Tạo user
    const user = await User.create({
      TenDangNhap: tenDangNhap,
      MatKhau: hashedPassword,
      TenNguoiDung: tenNguoiDung,
      MaNhom: maNhom || 1, // Default nhóm 1 nếu không truyền
    });

    // Xóa password khỏi response
    delete user.MatKhau;

    logger.info(`[REGISTER] User registered successfully: ${user.TenDangNhap}`);
    return successResponse(res, user, 'Đăng ký thành công', 201);
  } catch (error) {
    logger.error(`[REGISTER] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

// Login
export const login = async (req, res) => {
  logger.info('[LOGIN] Login request received');
  try {
    const { tenDangNhap, matKhau } = req.body;

    // Validate
    validateLogin(tenDangNhap, matKhau);

    // Tìm user
    const user = await User.findByUsername(tenDangNhap);
    if (!user) {
      logger.error('[LOGIN] User not found');
      return errorResponse(res, 'Tên đăng nhập hoặc mật khẩu không đúng', 401);
    }

    // Kiểm tra password
    const isPasswordValid = await comparePassword(matKhau, user.MatKhau);
    if (!isPasswordValid) {
      logger.error('[LOGIN] Invalid password');
      return errorResponse(res, 'Tên đăng nhập hoặc mật khẩu không đúng', 401);
    }

    // Tạo tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // Lưu refresh token
    await saveRefreshToken(user.MaNguoiDung, refreshToken);

    // Response
    logger.info(`[LOGIN] User logged in successfully: ${user.TenDangNhap}`);
    return successResponse(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user.MaNguoiDung,
          username: user.TenDangNhap,
          name: user.TenNguoiDung,
          maNhom: user.MaNhom,
        },
      },
      'Đăng nhập thành công',
      200
    );
  } catch (error) {
    logger.error(`[LOGIN] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

// Refresh access token
export const refreshAccessToken = async (req, res) => {
  logger.info('[REFRESH] Refresh token request received');
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token không được để trống', 400);
    }

    // Kiểm tra refresh token
    const tokenData = await RefreshToken.findByToken(refreshToken);
    if (!tokenData) {
      return errorResponse(res, 'Refresh token không hợp lệ hoặc đã hết hạn', 401);
    }

    // Lấy thông tin user
    const user = await User.findById(tokenData.MaNguoiDung);
    if (!user) {
      return errorResponse(res, 'User không tồn tại', 404);
    }

    // Tạo access token mới
    const accessToken = generateAccessToken(user);

    logger.info(`[REFRESH] Access token refreshed for user: ${user.TenDangNhap}`);
    return successResponse(res, { accessToken }, 'Làm mới token thành công', 200);
  } catch (error) {
    logger.error(`[REFRESH] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

// Logout
export const logout = async (req, res) => {
  logger.info('[LOGOUT] Logout request received');
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.remove(refreshToken);
    }

    logger.info('[LOGOUT] User logged out successfully');
    return successResponse(res, null, 'Đăng xuất thành công', 200);
  } catch (error) {
    logger.error(`[LOGOUT] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User không tồn tại', 404);
    }

    // Xóa password
    delete user.MatKhau;

    return successResponse(res, user, 'Lấy thông tin user thành công', 200);
  } catch (error) {
    logger.error(`[GET_CURRENT_USER] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();

    // Xóa password
    const usersWithoutPassword = users.map((user) => {
      const { MatKhau, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return successResponse(res, usersWithoutPassword, 'Lấy danh sách user thành công', 200);
  } catch (error) {
    logger.error(`[GET_ALL_USERS] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenNguoiDung, maNhom, matKhau } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'User không tồn tại', 404);
    }

    const updateData = {
      TenNguoiDung: tenNguoiDung || user.TenNguoiDung,
      MaNhom: maNhom || user.MaNhom,
    };

    // Nếu có password mới thì hash
    if (matKhau) {
      updateData.MatKhau = await hashPassword(matKhau);
    }

    const updated = await User.update(id, updateData);
    delete updated.MatKhau;

    return successResponse(res, updated, 'Cập nhật user thành công', 200);
  } catch (error) {
    logger.error(`[UPDATE_USER] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'User không tồn tại', 404);
    }

    // Xóa tất cả refresh token của user
    await RefreshToken.removeAllByUser(id);

    // Xóa user
    await User.remove(id);

    return successResponse(res, null, 'Xóa user thành công', 200);
  } catch (error) {
    logger.error(`[DELETE_USER] Error: ${error.message}`);
    return errorResponse(res, error.message, 500);
  }
};