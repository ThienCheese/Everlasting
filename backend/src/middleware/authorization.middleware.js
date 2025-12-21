import { errorResponse } from '../helpers/response.helper.js';

/**
 * Middleware kiểm tra quyền truy cập resource
 * Đảm bảo user chỉ có thể truy cập resource của mình
 */
export const checkResourceOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id; // Lấy từ auth middleware
      const resourceId = req.params.id;

      if (!userId) {
        return errorResponse(res, 'Khong co thong tin nguoi dung', 401);
      }

      // Logic kiểm tra ownership dựa vào resource type
      // Có thể expand thêm cho từng loại resource
      
      next();
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  };
};

/**
 * Middleware kiểm tra quyền quản trị
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Khong co thong tin nguoi dung', 401);
  }

  // Giả sử admin có MaNhom = 1
  if (req.user.maNhom !== 1) {
    return errorResponse(res, 'Chi admin moi co quyen thuc hien thao tac nay', 403);
  }

  next();
};

/**
 * Middleware kiểm tra quyền theo nhóm
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Khong co thong tin nguoi dung', 401);
    }

    if (!allowedRoles.includes(req.user.maNhom)) {
      return errorResponse(res, 'Ban khong co quyen truy cap', 403);
    }

    next();
  };
};

/**
 * Middleware kiểm tra quyền theo chức năng
 */
export const requirePermission = (tenChucNang) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Khong co thong tin nguoi dung', 401);
      }

      // Kiểm tra quyền trong database
      const hasPermission = await checkUserPermission(req.user.maNhom, tenChucNang);

      if (!hasPermission) {
        return errorResponse(res, `Ban khong co quyen ${tenChucNang}`, 403);
      }

      next();
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  };
};

/**
 * Helper function kiểm tra quyền user
 */
async function checkUserPermission(maNhom, tenChucNang) {
  // Import model ở đây để tránh circular dependency
  const PhanQuyen = (await import('../models/phanquyen.model.js')).default;
  const ChucNang = (await import('../models/chucnang.model.js')).default;

  // Lấy chức năng theo tên
  const chucNang = await ChucNang.findByTen(tenChucNang);
  
  if (!chucNang) {
    return false;
  }

  // Kiểm tra quyền
  return await PhanQuyen.checkPermission(maNhom, chucNang.MaChucNang);
}

export default {
  checkResourceOwnership,
  requireAdmin,
  requireRole,
  requirePermission
};
