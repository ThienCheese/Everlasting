/**
 * PermissionGuard Component
 * Bảo vệ components/routes dựa trên quyền của user
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission, useAnyPermission } from '../hooks/usePermission';

/**
 * Component để bảo vệ route hoặc feature theo permission
 * @param {Object} props
 * @param {string} props.permission - Permission key cần kiểm tra
 * @param {string[]} props.anyOf - Array permission keys (chỉ cần 1 trong số này)
 * @param {React.ReactNode} props.children - Component con
 * @param {React.ReactNode} props.fallback - Component hiển thị khi không có quyền
 * @param {string} props.redirectTo - Path để redirect khi không có quyền
 * @param {boolean} props.hideIfNoPermission - Ẩn component thay vì hiển thị fallback
 */
export const PermissionGuard = ({ 
  permission, 
  anyOf,
  children, 
  fallback = null,
  redirectTo = null,
  hideIfNoPermission = false
}) => {
  // Check single permission hoặc multiple permissions
  const singleCheck = usePermission(permission);
  const multiCheck = useAnyPermission(anyOf);

  // Determine which check to use
  const { hasPermission, loading, error } = permission ? singleCheck : multiCheck;

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    console.error('Permission check error:', error);
    return hideIfNoPermission ? null : (fallback || <div>Error checking permissions</div>);
  }

  // No permission
  if (!hasPermission) {
    // Redirect if specified
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Hide if specified
    if (hideIfNoPermission) {
      return null;
    }

    // Show fallback
    return fallback || <div>Bạn không có quyền truy cập tính năng này</div>;
  }

  // Has permission - render children
  return <>{children}</>;
};

/**
 * Higher Order Component để wrap component với permission check
 * @param {React.Component} Component - Component cần bảo vệ
 * @param {Object} options - Cấu hình permission
 * @returns {React.Component}
 */
export const withPermission = (Component, options = {}) => {
  return (props) => {
    return (
      <PermissionGuard {...options}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
};

/**
 * Component để conditionally render dựa trên permission (không có fallback/redirect)
 * Dùng để ẩn/hiện buttons, menu items, etc.
 */
export const IfHasPermission = ({ permission, anyOf, children }) => {
  return (
    <PermissionGuard 
      permission={permission} 
      anyOf={anyOf}
      hideIfNoPermission={true}
    >
      {children}
    </PermissionGuard>
  );
};

export default PermissionGuard;
