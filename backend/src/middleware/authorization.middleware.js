import { errorResponse } from '../helpers/response.helper.js';
import logger from '../helpers/logger.js';

/**
 * RBAC Middleware - Role-Based Access Control
 * Hệ thống phân quyền dựa trên:
 * - NHOMNGUOIDUNG: Nhóm người dùng (Admin, Lễ tân, Quản lý, Bếp trưởng, Kế toán)
 * - CHUCNANG: Các chức năng/màn hình trong hệ thống
 * - PHANQUYEN: Ma trận mapping giữa nhóm và chức năng
 */

/**
 * Middleware kiểm tra quyền truy cập resource
 * Đảm bảo user chỉ có thể truy cập resource của mình
 */
export const checkResourceOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
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
 * Middleware kiểm tra quyền quản trị (DEPRECATED)
 * @deprecated Sử dụng requirePermission thay thế để phân quyền chi tiết hơn
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Khong co thong tin nguoi dung', 401);
  }

  // Admin có MaNhom = 1
  if (req.user.maNhom !== 1) {
    return errorResponse(res, 'Chi admin moi co quyen thuc hien thao tac nay', 403);
  }

  next();
};

/**
 * Middleware kiểm tra quyền theo nhóm
 * @param {...number} allowedRoles - Danh sách MaNhom được phép truy cập
 * @example requireRole(1, 2, 3) // Cho phép Admin, Lễ tân, Quản lý
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Khong co thong tin nguoi dung', 401);
    }

    if (!allowedRoles.includes(req.user.maNhom)) {
      logger.warn(`[RBAC] User ${req.user.id} (Nhom ${req.user.maNhom}) tried to access role-restricted resource`);
      return errorResponse(res, 'Ban khong co quyen truy cap', 403);
    }

    next();
  };
};

/**
 * Middleware kiểm tra quyền theo mã chức năng (RECOMMENDED)
 * @param {number|string|Function} maChucNangOrGetter - Mã chức năng, key string, hoặc getter function
 * @example requirePermission(1) // Trực tiếp dùng ID
 * @example requirePermission('QUAN_LY_SANH') // Dùng key string (recommended)
 * @example requirePermission(() => PERMISSIONS.QUAN_LY_SANH.id) // Lazy evaluation
 */
export const requirePermission = (maChucNangOrGetter) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Khong co thong tin nguoi dung', 401);
      }

      const maNhom = req.user.maNhom;

      // Resolve permission ID tại runtime
      let maChucNang;
      if (typeof maChucNangOrGetter === 'function') {
        // Lazy getter: () => PERMISSIONS.QUAN_LY_SANH.id
        maChucNang = maChucNangOrGetter();
      } else if (typeof maChucNangOrGetter === 'string') {
        // String key: 'QUAN_LY_SANH'
        const permissionService = (await import('../services/permission.service.js')).default;
        maChucNang = permissionService.getPermissionId(maChucNangOrGetter);
        if (!maChucNang) {
          logger.error(`[RBAC] Permission key '${maChucNangOrGetter}' not found in database`);
          return errorResponse(res, `Chuc nang '${maChucNangOrGetter}' khong ton tai`, 500);
        }
      } else {
        // Numeric ID
        maChucNang = maChucNangOrGetter;
      }

      // Validate maChucNang
      if (!maChucNang || typeof maChucNang !== 'number') {
        logger.error(`[RBAC] Invalid permission ID: ${maChucNang}`);
        return errorResponse(res, `Ma chuc nang khong hop le`, 500);
      }

      // Kiểm tra quyền trong database
      const hasPermission = await checkUserPermission(maNhom, maChucNang);

      if (!hasPermission) {
        logger.warn(`[RBAC] User ${req.user.id} (Nhom ${maNhom}) denied access to ChucNang ${maChucNang}`);
        return errorResponse(res, `Ban khong co quyen truy cap chuc nang nay`, 403);
      }

      logger.info(`[RBAC] User ${req.user.id} (Nhom ${maNhom}) granted access to ChucNang ${maChucNang}`);
      next();
    } catch (error) {
      logger.error(`[RBAC] Error checking permission: ${error.message}`);
      return errorResponse(res, error.message, 500);
    }
  };
};

/**
 * Helper function kiểm tra quyền user
 * @param {number} maNhom - Mã nhóm người dùng
 * @param {number} maChucNang - Mã chức năng
 * @returns {Promise<boolean>}
 */
async function checkUserPermission(maNhom, maChucNang) {
  try {
    // Import model ở đây để tránh circular dependency
    const PhanQuyen = (await import('../models/phanquyen.model.js')).default;

    // Kiểm tra quyền trong bảng PHANQUYEN
    const hasPermission = await PhanQuyen.checkPermission(maNhom, maChucNang);
    
    return hasPermission;
  } catch (error) {
    logger.error(`[RBAC] Error in checkUserPermission: ${error.message}`);
    return false;
  }
}

export default {
  checkResourceOwnership,
  requireAdmin,
  requireRole,
  requirePermission
};
