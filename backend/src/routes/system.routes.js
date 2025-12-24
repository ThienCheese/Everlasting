/**
 * System Routes - Public endpoints for system constants
 */

import express from 'express';
import permissionService from '../services/permission.service.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';

const router = express.Router();

/**
 * GET /api/system/roles
 * Lấy danh sách roles
 * Public endpoint - Frontend cần load khi khởi động
 */
router.get('/roles', async (req, res) => {
  try {
    await permissionService.initialize();
    const roles = permissionService.getRoles();
    const rolesById = permissionService.getRolesById();
    
    res.json({
      success: true,
      data: {
        roles,
        rolesById
      },
      statusCode: 200
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách roles',
      statusCode: 500
    });
  }
});

/**
 * GET /api/system/permissions
 * Lấy danh sách permissions
 * Public endpoint - Frontend cần load khi khởi động
 */
router.get('/permissions', async (req, res) => {
  try {
    await permissionService.initialize();
    const permissions = permissionService.getPermissions();
    const permissionsById = permissionService.getPermissionsById();
    
    res.json({
      success: true,
      data: {
        permissions,
        permissionsById
      },
      statusCode: 200
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách permissions',
      statusCode: 500
    });
  }
});

/**
 * GET /api/system/permission-matrix
 * Lấy ma trận phân quyền
 * Public endpoint - Frontend cần load khi khởi động
 */
router.get('/permission-matrix', async (req, res) => {
  try {
    await permissionService.initialize();
    const matrix = permissionService.getPermissionMatrix();
    
    res.json({
      success: true,
      data: matrix,
      statusCode: 200
    });
  } catch (error) {
    console.error('Error fetching permission matrix:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy ma trận phân quyền',
      statusCode: 500
    });
  }
});

/**
 * GET /api/system/constants
 * Lấy tất cả constants trong một request
 * Recommended endpoint để frontend dùng
 */
router.get('/constants', async (req, res) => {
  try {
    await permissionService.initialize();
    
    const roles = permissionService.getRoles();
    const rolesById = permissionService.getRolesById();
    const permissions = permissionService.getPermissions();
    const permissionsById = permissionService.getPermissionsById();
    const matrix = permissionService.getPermissionMatrix();
    
    res.json({
      success: true,
      data: {
        roles,
        rolesById,
        permissions,
        permissionsById,
        permissionMatrix: matrix
      },
      message: 'System constants loaded successfully',
      statusCode: 200
    });
  } catch (error) {
    console.error('Error fetching system constants:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy system constants',
      statusCode: 500
    });
  }
});

/**
 * GET /api/system/my-permissions
 * Lấy permissions của user hiện tại
 * Protected endpoint - Cần authentication
 */
router.get('/my-permissions', authMiddleware, async (req, res) => {
  try {
    await permissionService.initialize();
    
    const userRole = req.user.maNhom;
    const roleName = permissionService.getRoleName(userRole);
    const permissions = permissionService.getRolePermissions(userRole);
    
    res.json({
      success: true,
      data: {
        role: {
          id: userRole,
          name: roleName
        },
        permissions
      },
      statusCode: 200
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy permissions của user',
      statusCode: 500
    });
  }
});

/**
 * POST /api/system/check-permission
 * Kiểm tra quyền của user
 * Protected endpoint - Cần authentication
 */
router.post('/check-permission', authMiddleware, async (req, res) => {
  try {
    await permissionService.initialize();
    
    const { maChucNang } = req.body;
    
    if (!maChucNang) {
      return res.status(400).json({
        success: false,
        message: 'maChucNang is required',
        statusCode: 400
      });
    }

    const userRole = req.user.maNhom;
    const hasPermission = permissionService.hasPermission(userRole, maChucNang);
    
    res.json({
      success: true,
      data: {
        hasPermission,
        role: userRole,
        permission: maChucNang
      },
      statusCode: 200
    });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể kiểm tra quyền',
      statusCode: 500
    });
  }
});

/**
 * POST /api/system/refresh-permissions
 * Refresh permission cache từ database
 * Protected endpoint - Chỉ Admin (MaChucNang = 1: Quản lý người dùng)
 */
router.post('/refresh-permissions', authMiddleware, requirePermission(1), async (req, res) => {
  try {
    await permissionService.refresh();
    
    res.json({
      success: true,
      message: 'Permissions cache refreshed successfully',
      statusCode: 200
    });
  } catch (error) {
    console.error('Error refreshing permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể refresh permissions cache',
      statusCode: 500
    });
  }
});

/**
 * GET /api/system/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const isInitialized = permissionService.initialized;
  
  res.json({
    success: true,
    data: {
      service: 'permission',
      status: isInitialized ? 'ready' : 'not initialized',
      timestamp: new Date().toISOString()
    },
    statusCode: 200
  });
});

export default router;
