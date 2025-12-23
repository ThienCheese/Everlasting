import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component để handle các lỗi authentication globally
 * Lắng nghe event từ fetchWithAuth khi refresh token fail
 */
const AuthErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for token expiration events
    const handleTokenExpired = (event) => {
      const { message } = event.detail || {};
      
      // Clear all auth data
      localStorage.clear();
      
      // Show notification to user
      if (message) {
        // Could use a toast notification library here
        console.warn(message);
      }
      
      // Redirect to login
      navigate('/login', { 
        replace: true,
        state: { message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }
      });
    };

    // Add event listener
    window.addEventListener('auth:token-expired', handleTokenExpired);

    // Cleanup
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
    };
  }, [navigate]);

  // This component doesn't render anything
  return null;
};

export default AuthErrorHandler;
