/**
 * Permission Service - Database-Driven Approach
 * Load và cache permissions từ database
 */

import NhomNguoiDung from '../models/nhomnguoidung.model.js';
import ChucNang from '../models/chucnang.model.js';
import PhanQuyen from '../models/phanquyen.model.js';

class PermissionService {
  constructor() {
    this.roles = null;
    this.permissions = null;
    this.permissionMatrix = null;
    this.initialized = false;
    this.initPromise = null;
  }

  /**
   * Load tất cả constants từ database và cache trong memory
   */
  async initialize() {
    // Nếu đã khởi tạo rồi, return luôn
    if (this.initialized) {
      return;
    }

    // Nếu đang khởi tạo, đợi promise cũ
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  async _doInitialize() {
    try {
      console.log('🔄 Initializing permission service from database...');

      // Load roles từ NHOMNGUOIDUNG
      const rolesData = await NhomNguoiDung.getAll();
      this.roles = {};
      this.rolesById = {};
      
      rolesData.forEach(role => {
        const key = this.normalizeKey(role.TenNhom);
        this.roles[key] = {
          id: role.MaNhom,
          name: role.TenNhom
        };
        this.rolesById[role.MaNhom] = {
          key: key,
          name: role.TenNhom
        };
      });

      // Load permissions từ CHUCNANG
      const permissionsData = await ChucNang.getAll();
      this.permissions = {};
      this.permissionsById = {};
      
      permissionsData.forEach(permission => {
        const key = this.normalizeKey(permission.TenChucNang);
        this.permissions[key] = {
          id: permission.MaChucNang,
          name: permission.TenChucNang,
          screen: permission.TenManHinh
        };
        this.permissionsById[permission.MaChucNang] = {
          key: key,
          name: permission.TenChucNang,
          screen: permission.TenManHinh
        };
      });

      // Load permission matrix từ PHANQUYEN
      this.permissionMatrix = {};
      
      for (const role of rolesData) {
        const rolePermissions = await NhomNguoiDung.getPermissions(role.MaNhom);
        this.permissionMatrix[role.MaNhom] = rolePermissions.map(p => p.MaChucNang);
      }

      this.initialized = true;
      this.initPromise = null;

      console.log('✅ Permission service initialized successfully');
      console.log(`   - Roles: ${Object.keys(this.roles).length}`);
      console.log(`   - Permissions: ${Object.keys(this.permissions).length}`);
      console.log(`   - Permission matrix loaded for ${Object.keys(this.permissionMatrix).length} roles`);

    } catch (error) {
      console.error('❌ Failed to initialize permission service:', error.message);
      this.initPromise = null;
      
      // Don't throw error - let the app continue without permission cache
      // Permissions will be checked directly from database when needed
      console.warn('⚠️  Permission service will fall back to database queries');
    }
  }

  /**
   * Normalize key từ tên tiếng Việt
   * Ví dụ: "Quản lý người dùng" -> "QUAN_LY_NGUOI_DUNG"
   * "Admin" -> "ADMIN"
   * "Lễ tân" -> "LE_TAN"
   */
  normalizeKey(name) {
    return name
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (á -> a, ô -> o)
      .replace(/Đ/g, 'D')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '_') // Space to underscore
      .replace(/[^A-Z0-9_]/g, ''); // Remove non-alphanumeric
  }

  /**
   * Lấy danh sách roles
   * @returns {Object} - Object chứa roles với key là tên chuẩn hóa
   */
  getRoles() {
    if (!this.ensureInitialized()) return {};
    return this.roles;
  }

  /**
   * Lấy danh sách roles theo ID
   * @returns {Object} - Object với key là MaNhom
   */
  getRolesById() {
    if (!this.ensureInitialized()) return {};
    return this.rolesById;
  }

  /**
   * Lấy danh sách permissions
   * @returns {Object} - Object chứa permissions với key là tên chuẩn hóa
   */
  getPermissions() {
    if (!this.ensureInitialized()) return {};
    return this.permissions;
  }

  /**
   * Lấy danh sách permissions theo ID
   * @returns {Object} - Object với key là MaChucNang
   */
  getPermissionsById() {
    if (!this.ensureInitialized()) return {};
    return this.permissionsById;
  }

  /**
   * Lấy permission matrix
   * @returns {Object} - Object với key là MaNhom, value là array MaChucNang
   */
  getPermissionMatrix() {
    if (!this.ensureInitialized()) return {};
    return this.permissionMatrix;
  }

  /**
   * Kiểm tra quyền của user
   * @param {number} maNhom - Mã nhóm của user
   * @param {number} maChucNang - Mã chức năng cần kiểm tra
   * @returns {boolean}
   */
  hasPermission(maNhom, maChucNang) {
    if (!this.ensureInitialized()) return false;
    
    const rolePermissions = this.permissionMatrix[maNhom] || [];
    return rolePermissions.includes(maChucNang);
  }

  /**
   * Kiểm tra user có bất kỳ permission nào trong list
   * @param {number} maNhom - Mã nhóm của user
   * @param {number[]} maChucNangList - Array các mã chức năng
   * @returns {boolean}
   */
  hasAnyPermission(maNhom, maChucNangList) {
    this.ensureInitialized();
    
    if (!maChucNangList || maChucNangList.length === 0) {
      return false;
    }

    const rolePermissions = this.permissionMatrix[maNhom] || [];
    return maChucNangList.some(maChucNang => rolePermissions.includes(maChucNang));
  }

  /**
   * Kiểm tra user có tất cả permissions trong list
   * @param {number} maNhom - Mã nhóm của user
   * @param {number[]} maChucNangList - Array các mã chức năng
   * @returns {boolean}
   */
  hasAllPermissions(maNhom, maChucNangList) {
    if (!this.ensureInitialized()) return false;
    
    if (!maChucNangList || maChucNangList.length === 0) {
      return false;
    }

    const rolePermissions = this.permissionMatrix[maNhom] || [];
    return maChucNangList.every(maChucNang => rolePermissions.includes(maChucNang));
  }

  /**
   * Lấy tên role từ ID
   * @param {number} maNhom - Mã nhóm
   * @returns {string} - Tên nhóm
   */
  getRoleName(maNhom) {
    if (!this.ensureInitialized()) return 'Unknown';
    
    const role = this.rolesById[maNhom];
    return role ? role.name : 'Unknown';
  }

  /**
   * Lấy tên permission từ ID
   * @param {number} maChucNang - Mã chức năng
   * @returns {string} - Tên chức năng
   */
  getPermissionName(maChucNang) {
    if (!this.ensureInitialized()) return 'Unknown';
    
    const permission = this.permissionsById[maChucNang];
    return permission ? permission.name : 'Unknown';
  }

  /**
   * Lấy danh sách permissions của một role
   * @param {number} maNhom - Mã nhóm
   * @returns {Array} - Array các permission objects
   */
  getRolePermissions(maNhom) {
    if (!this.ensureInitialized()) return [];
    
    const permissionIds = this.permissionMatrix[maNhom] || [];
    return permissionIds.map(id => this.permissionsById[id]).filter(Boolean);
  }

  /**
   * Refresh cache từ database
   */
  async refresh() {
    console.log('🔄 Refreshing permission cache from database...');
    this.initialized = false;
    this.initPromise = null;
    await this.initialize();
  }

  /**
   * Kiểm tra service đã được khởi tạo chưa
   */
  ensureInitialized() {
    if (!this.initialized) {
      console.warn('⚠️  Permission service not initialized. Returning empty data.');
      return false;
    }
    return true;
  }

  /**
   * Export constants để tương thích với code cũ
   */
  getConstants() {
    if (!this.ensureInitialized()) {
      return {
        ROLES: {},
        PERMISSIONS: {},
        PERMISSION_MATRIX: {}
      };
    }
    
    return {
      ROLES: this.roles,
      PERMISSIONS: this.permissions,
      PERMISSION_MATRIX: this.permissionMatrix
    };
  }

  /**
   * Get ROLES constant object (for backward compatibility)
   * Returns object like: { ADMIN: { id: 1, name: "Admin" }, ... }
   */
  get ROLES() {
    if (!this.ensureInitialized()) return {};
    return this.roles;
  }

  /**
   * Get PERMISSIONS constant object (for backward compatibility)
   * Returns object like: { MANAGE_USERS: { id: 1, name: "..." }, ... }
   */
  get PERMISSIONS() {
    if (!this.ensureInitialized()) return {};
    return this.permissions;
  }

  /**
   * Get permission ID by normalized key
   * Example: getPermissionId('MANAGE_HALLS') -> 2
   */
  getPermissionId(key) {
    if (!this.ensureInitialized()) return null;
    const permission = this.permissions[key];
    return permission ? permission.id : null;
  }

  /**
   * Get role ID by normalized key
   * Example: getRoleId('ADMIN') -> 1
   */
  getRoleId(key) {
    if (!this.ensureInitialized()) return null;
    const role = this.roles[key];
    return role ? role.id : null;
  }
}

// Singleton instance
const permissionService = new PermissionService();

export default permissionService;
export { permissionService };

/**
 * Helper function to get permission ID safely
 * Usage: getPermissionId('MANAGE_HALLS') or getPermissionId('QUAN_LY_SANH')
 */
export const getPermissionId = (key) => {
  if (!permissionService.initialized) {
    console.warn(`⚠️ Accessing permission ${key} before service initialized.`);
    return null;
  }
  const permission = permissionService.permissions[key];
  return permission ? permission.id : null;
};

/**
 * Helper function to get role ID safely
 * Usage: getRoleId('ADMIN') or getRoleId('GUEST')
 */
export const getRoleId = (key) => {
  if (!permissionService.initialized) {
    console.warn(`⚠️ Accessing role ${key} before service initialized.`);
    return null;
  }
  const role = permissionService.roles[key];
  return role ? role.id : null;
};

// Export Proxy objects for backward compatibility
// These mimic the old structure: PERMISSIONS.MANAGE_HALLS.id
export const ROLES = new Proxy({}, {
  get(target, prop) {
    if (!permissionService.initialized) {
      console.warn(`⚠️ Accessing ROLES.${prop} before service initialized.`);
      return { id: null, name: null };
    }
    return permissionService.roles[prop] || { id: null, name: null };
  }
});

export const PERMISSIONS = new Proxy({}, {
  get(target, prop) {
    if (!permissionService.initialized) {
      console.warn(`⚠️ Accessing PERMISSIONS.${prop} before service initialized.`);
      return { id: null, name: null, screen: null };
    }
    return permissionService.permissions[prop] || { id: null, name: null, screen: null };
  }
});

export const PERMISSION_MATRIX = new Proxy({}, {
  get(target, prop) {
    if (!permissionService.initialized) {
      console.warn(`⚠️ Accessing PERMISSION_MATRIX[${prop}] before service initialized.`);
      return [];
    }
    return permissionService.permissionMatrix[prop] || [];
  }
});
