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
      console.error('❌ Failed to initialize permission service:', error);
      this.initPromise = null;
      throw error;
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
    this.ensureInitialized();
    return this.roles;
  }

  /**
   * Lấy danh sách roles theo ID
   * @returns {Object} - Object với key là MaNhom
   */
  getRolesById() {
    this.ensureInitialized();
    return this.rolesById;
  }

  /**
   * Lấy danh sách permissions
   * @returns {Object} - Object chứa permissions với key là tên chuẩn hóa
   */
  getPermissions() {
    this.ensureInitialized();
    return this.permissions;
  }

  /**
   * Lấy danh sách permissions theo ID
   * @returns {Object} - Object với key là MaChucNang
   */
  getPermissionsById() {
    this.ensureInitialized();
    return this.permissionsById;
  }

  /**
   * Lấy permission matrix
   * @returns {Object} - Object với key là MaNhom, value là array MaChucNang
   */
  getPermissionMatrix() {
    this.ensureInitialized();
    return this.permissionMatrix;
  }

  /**
   * Kiểm tra quyền của user
   * @param {number} maNhom - Mã nhóm của user
   * @param {number} maChucNang - Mã chức năng cần kiểm tra
   * @returns {boolean}
   */
  hasPermission(maNhom, maChucNang) {
    this.ensureInitialized();
    
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
    this.ensureInitialized();
    
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
    this.ensureInitialized();
    
    const role = this.rolesById[maNhom];
    return role ? role.name : 'Unknown';
  }

  /**
   * Lấy tên permission từ ID
   * @param {number} maChucNang - Mã chức năng
   * @returns {string} - Tên chức năng
   */
  getPermissionName(maChucNang) {
    this.ensureInitialized();
    
    const permission = this.permissionsById[maChucNang];
    return permission ? permission.name : 'Unknown';
  }

  /**
   * Lấy danh sách permissions của một role
   * @param {number} maNhom - Mã nhóm
   * @returns {Array} - Array các permission objects
   */
  getRolePermissions(maNhom) {
    this.ensureInitialized();
    
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
      throw new Error('Permission service not initialized. Call initialize() first.');
    }
  }

  /**
   * Export constants để tương thích với code cũ
   */
  getConstants() {
    this.ensureInitialized();
    
    return {
      ROLES: this.roles,
      PERMISSIONS: this.permissions,
      PERMISSION_MATRIX: this.permissionMatrix
    };
  }
}

// Singleton instance
const permissionService = new PermissionService();

export default permissionService;
export { permissionService };
