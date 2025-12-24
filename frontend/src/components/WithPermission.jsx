import React from 'react';
import { Navigate } from 'react-router-dom';
import authUtils from '../utils/auth';
import permissionService from '../services/permissionService';

/**
 * Higher Order Component để bảo vệ routes theo permissions
 * 
 * @param {React.Component} Component - Component cần bảo vệ
 * @param {number|number[]} requiredPermissions - Permission ID(s) cần thiết
 * @param {boolean} requireAll - Nếu true, cần tất cả permissions. Nếu false, chỉ cần 1.
 * @returns {React.Component}
 */
const WithPermission = ({ 
  children, 
  requiredPermissions, 
  requireAll = false,
  fallbackPath = '/home'
}) => {
  const user = authUtils.getUser();
  
  // Nếu chưa đăng nhập, redirect về login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.maNhom;

  // Nếu không yêu cầu permission cụ thể, cho phép truy cập
  if (!requiredPermissions) {
    return children;
  }

  // Chuyển đổi về array nếu là number
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  // Kiểm tra quyền
  const hasAccess = requireAll
    ? permissionService.hasAllPermissions(userRole, permissions)
    : permissionService.hasAnyPermission(userRole, permissions);

  // Nếu không có quyền, redirect về trang fallback
  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default WithPermission;
