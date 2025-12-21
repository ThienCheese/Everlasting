import React from 'react';
import { Navigate } from 'react-router-dom';
import authUtils from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  
  console.log('[ProtectedRoute] Check authentication:', isAuthenticated);
  console.log('[ProtectedRoute] AccessToken:', authUtils.getAccessToken() ? 'EXISTS' : 'MISSING');

  if (!isAuthenticated) {
    // Redirect về trang login nếu chưa đăng nhập
    console.log('[ProtectedRoute] Not authenticated, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;
