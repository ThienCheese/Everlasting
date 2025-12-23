import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <div className="access-denied-icon">🔒</div>
        <h1 className="access-denied-title">Truy cập bị từ chối</h1>
        <p className="access-denied-message">
          Bạn không có quyền truy cập trang này.
          <br />
          Vui lòng liên hệ Admin để được cấp quyền.
        </p>
        <button 
          className="access-denied-button"
          onClick={() => navigate('/home')}
        >
          Quay về Trang chủ
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
