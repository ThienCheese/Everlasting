import rateLimit from 'express-rate-limit';
import { errorResponse } from '../helpers/response.helper.js';

// Rate limiter cho API chung
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 requests mỗi IP trong 15 phút
  message: 'Qua nhieu request tu IP nay, vui long thu lai sau',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Qua nhieu request, vui long thu lai sau', 429);
  }
});

// Rate limiter nghiêm ngặt cho login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn 5 lần đăng nhập sai mỗi IP trong 15 phút
  message: 'Qua nhieu lan dang nhap sai, vui long thu lai sau 15 phut',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Qua nhieu lan dang nhap sai, vui long thu lai sau 15 phut', 429);
  }
});

// Rate limiter cho các thao tác tạo mới
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10, // Giới hạn 10 lần tạo mới mỗi phút
  message: 'Qua nhieu thao tac tao moi, vui long thu lai',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Qua nhieu thao tac tao moi, vui long doi mot chut', 429);
  }
});

// Rate limiter cho các thao tác xóa
export const deleteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 20, // Giới hạn 20 lần xóa mỗi phút
  message: 'Qua nhieu thao tac xoa, vui long thu lai',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Qua nhieu thao tac xoa, vui long doi mot chut', 429);
  }
});

// Rate limiter cho flow đặt tiệc (cần nhiều requests)
export const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 50, // Giới hạn 50 requests mỗi phút (cho phép tạo thực đơn + nhiều món ăn + nhiều dịch vụ)
  message: 'Qua nhieu thao tac dat tiec, vui long thu lai',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Qua nhieu thao tac, vui long doi mot chut', 429);
  }
});

export default {
  apiLimiter,
  loginLimiter,
  createLimiter,
  deleteLimiter,
  bookingLimiter
};
