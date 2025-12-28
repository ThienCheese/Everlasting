/**
 * usePermission Hook
 * Custom React hook để check quyền trong components
 */

import { useState, useEffect } from 'react';
import permissionService from '../services/permissionService';

/**
 * Hook để check permission của user hiện tại
 * @param {string} permissionKey - Permission key cần check (e.g., 'QUAN_LY_SANH')
 * @returns {Object} - { hasPermission, loading, error }
 */
export const usePermission = (permissionKey) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ensure permission service is initialized
        await permissionService.initialize();

        // Get current user
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setHasPermission(false);
          return;
        }

        const user = JSON.parse(userStr);
        if (!user.maNhom) {
          setHasPermission(false);
          return;
        }

        // Check permission
        const result = permissionService.hasPermission(user.maNhom, permissionKey);
        setHasPermission(result);

      } catch (err) {
        console.error('Error checking permission:', err);
        setError(err.message);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    if (permissionKey) {
      checkPermission();
    }
  }, [permissionKey]);

  return { hasPermission, loading, error };
};

/**
 * Hook để check multiple permissions (ANY)
 * @param {string[]} permissionKeys - Array of permission keys
 * @returns {Object} - { hasPermission, loading, error }
 */
export const useAnyPermission = (permissionKeys) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        await permissionService.initialize();

        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setHasPermission(false);
          return;
        }

        const user = JSON.parse(userStr);
        if (!user.maNhom) {
          setHasPermission(false);
          return;
        }

        const result = permissionService.hasAnyPermission(user.maNhom, permissionKeys);
        setHasPermission(result);

      } catch (err) {
        console.error('Error checking permissions:', err);
        setError(err.message);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    if (permissionKeys && permissionKeys.length > 0) {
      checkPermissions();
    }
  }, [JSON.stringify(permissionKeys)]);

  return { hasPermission, loading, error };
};

/**
 * Hook để lấy tất cả permissions của user hiện tại
 * @returns {Object} - { permissions, loading, error }
 */
export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        await permissionService.initialize();

        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setPermissions([]);
          return;
        }

        const user = JSON.parse(userStr);
        if (!user.maNhom) {
          setPermissions([]);
          return;
        }

        const result = permissionService.getRolePermissions(user.maNhom);
        setPermissions(result);

      } catch (err) {
        console.error('Error loading permissions:', err);
        setError(err.message);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  return { permissions, loading, error };
};

/**
 * Hook để lấy system constants (roles, permissions, matrix)
 * @returns {Object} - { constants, loading, error, refresh }
 */
export const useSystemConstants = () => {
  const [constants, setConstants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConstants = async () => {
    try {
      setLoading(true);
      setError(null);

      await permissionService.initialize();

      const data = {
        roles: permissionService.getRoles(),
        rolesById: permissionService.getRolesById(),
        permissions: permissionService.getPermissions(),
        permissionsById: permissionService.getPermissionsById(),
        permissionMatrix: permissionService.getPermissionMatrix()
      };

      setConstants(data);

    } catch (err) {
      console.error('Error loading system constants:', err);
      setError(err.message);
      setConstants(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConstants();
  }, []);

  const refresh = async () => {
    await permissionService.refresh();
    await loadConstants();
  };

  return { constants, loading, error, refresh };
};
