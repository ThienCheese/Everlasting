import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/users.model.js';
import RefreshToken from '../models/refreshtoken.model.js';

// Hash password với salt
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// So sánh password
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Tạo access token
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.MaNguoiDung,
      username: user.TenDangNhap,
      maNhom: user.MaNhom,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Access token hết hạn sau 1 giờ
  );
};

// Tạo refresh token
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Lưu refresh token vào database
export const saveRefreshToken = async (maNguoiDung, refreshToken) => {
  const hanSuDung = new Date();
  hanSuDung.setDate(hanSuDung.getDate() + 7); // Refresh token hết hạn sau 7 ngày

  await RefreshToken.create({
    MaNguoiDung: maNguoiDung,
    RefreshToken: refreshToken,
    HanSuDung: hanSuDung,
  });
};

// Validate register input
export const validateRegister = async (tenDangNhap, matKhau, tenNguoiDung, maNhom) => {
  // Check username đã tồn tại
  const existingUser = await User.findByUsername(tenDangNhap);
  if (existingUser) {
    throw new Error('Tên đăng nhập đã tồn tại');
  }

  // Validate độ dài password
  if (matKhau.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  // Validate tên người dùng
  if (!tenNguoiDung || tenNguoiDung.trim().length === 0) {
    throw new Error('Tên người dùng không được để trống');
  }

  // Check nhóm người dùng tồn tại
  const nhom = await db('NHOMNGUOIDUNG').where({ MaNhom: maNhom }).first();
  if (!nhom) {
    throw new Error('Nhóm người dùng không tồn tại');
  }
};

// Validate login input
export const validateLogin = (tenDangNhap, matKhau) => {
  if (!tenDangNhap || !matKhau) {
    throw new Error('Tên đăng nhập và mật khẩu không được để trống');
  }
};

// Import db
import db from '../../database/connection.js';
