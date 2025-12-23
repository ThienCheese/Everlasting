/**
 * Permission Management Utility
 * Wrapper around permissionService để maintain backward compatibility
 * DEPRECATED: Use permissionService directly for better performance
 */

import permissionService from '../services/permissionService';

// Export ROLES và PERMISSIONS từ service
// Lưu ý: Cần đảm bảo service đã được initialized
export const ROLES = new Proxy({}, {
  get(target, prop) {
    return permissionService.ROLES[prop];
  }
});

export const PERMISSIONS = new Proxy({}, {
  get(target, prop) {
    return permissionService.PERMISSIONS[prop];
  }
});

/**
 * Kiểm tra user có permission hay không
 * @param {number} maNhom - Mã nhóm của user
 * @param {number} maChucNang - Mã chức năng hoặc permission ID
 * @returns {boolean}
 */
export const hasPermission = (maNhom, maChucNang) => {
  return permissionService.hasPermission(maNhom, maChucNang);
};

/**
 * Kiểm tra user có bất kỳ permission nào trong danh sách
 * @param {number} maNhom - Mã nhóm của user
 * @param {number[]} permissions - Danh sách mã chức năng
 * @returns {boolean}
 */
export const hasAnyPermission = (maNhom, permissions) => {
  return permissionService.hasAnyPermission(maNhom, permissions);
};

/**
 * Kiểm tra user có tất cả permissions trong danh sách
 * @param {number} maNhom - Mã nhóm của user
 * @param {number[]} permissions - Danh sách mã chức năng
 * @returns {boolean}
 */
export const hasAllPermissions = (maNhom, permissions) => {
  return permissionService.hasAllPermissions(maNhom, permissions);
};

/**
 * Kiểm tra user có phải là Admin
 * @param {number} maNhom - Mã nhóm của user
 * @returns {boolean}
 */
export const isAdmin = (maNhom) => {
  return permissionService.isAdmin(maNhom);
};

/**
 * Lấy danh sách tất cả permissions của user
 * @param {number} maNhom - Mã nhóm của user
 * @returns {Array}
 */
export const getUserPermissions = (maNhom) => {
  return permissionService.getRolePermissions(maNhom);
};

/**
 * Lấy tên role từ maNhom
 * @param {number} maNhom - Mã nhóm của user
 * @returns {string}
 */
export const getRoleName = (maNhom) => {
  return permissionService.getRoleName(maNhom);
};

export default {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  getUserPermissions,
  getRoleName
};
