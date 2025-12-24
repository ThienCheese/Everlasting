/**
 * Permission Service - Frontend
 * Load constants từ backend API và cache
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class PermissionService {
  constructor() {
    this.roles = null;
    this.rolesById = null;
    this.permissions = null;
    this.permissionsById = null;
    this.permissionMatrix = null;
    this.initialized = false;
  }

  /**
   * Load constants từ backend API
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      console.log('🔄 Loading system constants from backend...');

      // Gọi API để lấy tất cả constants trong một request
      const response = await fetch(`${API_BASE_URL}/system/constants`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load constants');
      }

      const { roles, rolesById, permissions, permissionsById, permissionMatrix } = result.data;

      this.roles = roles;
      this.rolesById = rolesById;
      this.permissions = permissions;
      this.permissionsById = permissionsById;
      this.permissionMatrix = permissionMatrix;

      // Cache vào localStorage
      this._cacheToLocalStorage();

      this.initialized = true;
      console.log('✅ System constants loaded successfully');
      console.log(`   - Roles: ${Object.keys(roles).length}`);
      console.log(`   - Permissions: ${Object.keys(permissions).length}`);

    } catch (error) {
      console.error('❌ Failed to load constants from backend:', error);
      console.log('🔄 Loading from localStorage cache...');
      
      // Fallback to localStorage cache
      this._loadFromCache();

      if (!this.initialized) {
        throw new Error('Failed to initialize permission service. No cache available.');
      }
    }
  }

  /**
   * Cache constants vào localStorage
   */
  _cacheToLocalStorage() {
    try {
      localStorage.setItem('app_roles', JSON.stringify(this.roles));
      localStorage.setItem('app_roles_by_id', JSON.stringify(this.rolesById));
      localStorage.setItem('app_permissions', JSON.stringify(this.permissions));
      localStorage.setItem('app_permissions_by_id', JSON.stringify(this.permissionsById));
      localStorage.setItem('app_permission_matrix', JSON.stringify(this.permissionMatrix));
      localStorage.setItem('app_constants_timestamp', Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache constants to localStorage:', error);
    }
  }

  /**
   * Load constants từ localStorage cache
   */
  _loadFromCache() {
    try {
      const rolesStr = localStorage.getItem('app_roles');
      const rolesByIdStr = localStorage.getItem('app_roles_by_id');
      const permsStr = localStorage.getItem('app_permissions');
      const permsByIdStr = localStorage.getItem('app_permissions_by_id');
      const matrixStr = localStorage.getItem('app_permission_matrix');

      if (!rolesStr || !permsStr || !matrixStr) {
        throw new Error('Cache not found');
      }

      this.roles = JSON.parse(rolesStr);
      this.rolesById = JSON.parse(rolesByIdStr || '{}');
      this.permissions = JSON.parse(permsStr);
      this.permissionsById = JSON.parse(permsByIdStr || '{}');
      this.permissionMatrix = JSON.parse(matrixStr);

      this.initialized = true;
      console.log('✅ Loaded constants from cache');
    } catch (error) {
      console.error('Failed to load from cache:', error);
    }
  }

  /**
   * Refresh constants từ backend
   */
  async refresh() {
    this.initialized = false;
    await this.initialize();
  }

  /**
   * Kiểm tra user có permission hay không
   * @param {number} maNhom - Mã nhóm của user
   * @param {number} maChucNang - Mã chức năng
   * @returns {boolean}
   */
  hasPermission(maNhom, maChucNang) {
    if (!this.initialized || !this.permissionMatrix) {
      return false;
    }

    const rolePerms = this.permissionMatrix[maNhom] || [];
    return rolePerms.includes(maChucNang);
  }

  /**
   * Kiểm tra user có bất kỳ permission nào
   * @param {number} maNhom - Mã nhóm của user
   * @param {number[]} maChucNangList - Danh sách mã chức năng
   * @returns {boolean}
   */
  hasAnyPermission(maNhom, maChucNangList) {
    if (!this.initialized || !maChucNangList || maChucNangList.length === 0) {
      return false;
    }

    return maChucNangList.some(maChucNang => this.hasPermission(maNhom, maChucNang));
  }

  /**
   * Kiểm tra user có tất cả permissions
   * @param {number} maNhom - Mã nhóm của user
   * @param {number[]} maChucNangList - Danh sách mã chức năng
   * @returns {boolean}
   */
  hasAllPermissions(maNhom, maChucNangList) {
    if (!this.initialized || !maChucNangList || maChucNangList.length === 0) {
      return false;
    }

    return maChucNangList.every(maChucNang => this.hasPermission(maNhom, maChucNang));
  }

  /**
   * Lấy role name từ ID
   * @param {number} maNhom - Mã nhóm
   * @returns {string}
   */
  getRoleName(maNhom) {
    if (!this.initialized || !this.rolesById) {
      return 'Unknown';
    }

    const role = this.rolesById[maNhom];
    return role ? role.name : 'Unknown';
  }

  /**
   * Lấy permission name từ ID
   * @param {number} maChucNang - Mã chức năng
   * @returns {string}
   */
  getPermissionName(maChucNang) {
    if (!this.initialized || !this.permissionsById) {
      return 'Unknown';
    }

    const permission = this.permissionsById[maChucNang];
    return permission ? permission.name : 'Unknown';
  }

  /**
   * Lấy danh sách permissions của role
   * @param {number} maNhom - Mã nhóm
   * @returns {Array}
   */
  getRolePermissions(maNhom) {
    if (!this.initialized || !this.permissionMatrix || !this.permissionsById) {
      return [];
    }

    const permissionIds = this.permissionMatrix[maNhom] || [];
    return permissionIds
      .map(id => this.permissionsById[id])
      .filter(Boolean);
  }

  /**
   * Get ROLES constants (để tương thích với code cũ)
   */
  get ROLES() {
    if (!this.initialized || !this.roles) {
      return {};
    }

    // Convert từ object sang constants format
    const rolesConstants = {};
    Object.entries(this.roles).forEach(([key, value]) => {
      rolesConstants[key] = value.id;
    });
    return rolesConstants;
  }

  /**
   * Get PERMISSIONS constants (để tương thích với code cũ)
   */
  get PERMISSIONS() {
    if (!this.initialized || !this.permissions) {
      return {};
    }

    // Convert từ object sang constants format
    const permsConstants = {};
    Object.entries(this.permissions).forEach(([key, value]) => {
      permsConstants[key] = value.id;
    });
    return permsConstants;
  }

  /**
   * Kiểm tra user có phải Admin
   * @param {number} maNhom - Mã nhóm
   * @returns {boolean}
   */
  isAdmin(maNhom) {
    // Admin luôn có MaNhom = 1
    return maNhom === 1;
  }

  /**
   * Check if service is ready
   */
  isReady() {
    return this.initialized;
  }
}

// Singleton instance
const permissionService = new PermissionService();

export default permissionService;
export { permissionService };
