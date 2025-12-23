# Constants vs Database - Analysis & Solution

## 🔍 Phân tích vấn đề

### Hiện trạng

Hiện tại hệ thống có **2 loại constants**:

#### 1. Backend Constants (`/backend/src/constants/permissions.js`)
```javascript
export const ROLES = {
  ADMIN: 1,
  RECEPTIONIST: 2, // Lễ tân
  MANAGER: 3,      // Quản lý
  CHEF: 4,         // Bếp trưởng
  ACCOUNTANT: 5,   // Kế toán
  GUEST: 6         // Guest
};

export const PERMISSIONS = {
  MANAGE_USERS: { id: 1, name: 'Quản lý người dùng' },
  MANAGE_HALLS: { id: 2, name: 'Quản lý sảnh' },
  MANAGE_FOOD: { id: 3, name: 'Quản lý món ăn' },
  MANAGE_SERVICE: { id: 4, name: 'Quản lý dịch vụ' },
  MANAGE_BOOKING: { id: 5, name: 'Quản lý đặt tiệc' }
};

export const PERMISSION_MATRIX = {
  [ROLES.ADMIN]: [1, 2, 3, 4, 5],
  [ROLES.RECEPTIONIST]: [2, 5],
  // ...
};
```

#### 2. Frontend Constants (`/frontend/src/utils/permissions.js`)
```javascript
export const ROLES = {
  ADMIN: 1,
  LE_TAN: 2,
  QUAN_LY: 3,
  BEP_TRUONG: 4,
  KE_TOAN: 5,
  GUEST: 6
};

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_HALLS: 'manage_halls',
  MANAGE_DISHES: 'manage_dishes',
  MANAGE_SERVICES: 'manage_services',
  MANAGE_BOOKINGS: 'manage_bookings',
  // ...
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_HALLS,
    // ...
  ],
  // ...
};
```

### ⚠️ Vấn đề

1. **Magic Numbers**: Các ID (1, 2, 3, 4, 5, 6) được hardcode
2. **Không đồng bộ với Database**: Nếu database thay đổi, constants không tự động cập nhật
3. **Duplicate Logic**: Ma trận phân quyền được define ở 2 nơi (backend + frontend)
4. **Maintenance Risk**: Khi thêm role/permission mới, phải sửa nhiều chỗ

---

## 🗄️ Database Structure

### Bảng NHOMNGUOIDUNG (Roles)
```sql
CREATE TABLE "NHOMNGUOIDUNG" (
  "MaNhom" INTEGER PRIMARY KEY,
  "TenNhom" VARCHAR(50) NOT NULL
);
```

**Expected Data:**
```sql
INSERT INTO "NHOMNGUOIDUNG" VALUES
  (1, 'Admin'),
  (2, 'Lễ tân'),
  (3, 'Quản lý'),
  (4, 'Bếp trưởng'),
  (5, 'Kế toán'),
  (6, 'Guest');
```

### Bảng CHUCNANG (Permissions)
```sql
CREATE TABLE "CHUCNANG" (
  "MaChucNang" INTEGER PRIMARY KEY,
  "TenChucNang" VARCHAR(100) NOT NULL,
  "TenManHinh" VARCHAR(100)
);
```

**Expected Data:**
```sql
INSERT INTO "CHUCNANG" VALUES
  (1, 'Quản lý người dùng', 'UserScreen'),
  (2, 'Quản lý sảnh', 'HallsScreen'),
  (3, 'Quản lý món ăn', 'FoodScreen'),
  (4, 'Quản lý dịch vụ', 'ServiceScreen'),
  (5, 'Quản lý đặt tiệc', 'BookingScreen');
```

### Bảng PHANQUYEN (Permission Matrix)
```sql
CREATE TABLE "PHANQUYEN" (
  "MaNhom" INTEGER REFERENCES "NHOMNGUOIDUNG"("MaNhom"),
  "MaChucNang" INTEGER REFERENCES "CHUCNANG"("MaChucNang"),
  PRIMARY KEY ("MaNhom", "MaChucNang")
);
```

**Expected Data:**
```sql
-- Admin có tất cả quyền
INSERT INTO "PHANQUYEN" VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- Lễ tân
INSERT INTO "PHANQUYEN" VALUES (2, 2), (2, 5);

-- Quản lý
INSERT INTO "PHANQUYEN" VALUES (3, 2), (3, 3), (3, 4);

-- Bếp trưởng
INSERT INTO "PHANQUYEN" VALUES (4, 3), (4, 5);

-- Kế toán
INSERT INTO "PHANQUYEN" VALUES (5, 5);

-- Guest không có quyền gì
```

---

## 🎯 Giải pháp

### Option 1: Magic Numbers + Strict Validation (Current - Quick Fix)

**Pros:**
- ✅ Fast performance (no DB query)
- ✅ Simple implementation
- ✅ Works offline

**Cons:**
- ❌ Không flexible
- ❌ Phải maintain 2 nơi (code + DB)
- ❌ Risk mất đồng bộ

**When to use:** Hệ thống nhỏ, roles/permissions ít thay đổi

---

### Option 2: Database-Driven (RECOMMENDED) ⭐

Load constants từ database khi app khởi động và cache trong memory.

**Pros:**
- ✅ Single source of truth (Database)
- ✅ Easy to add new roles/permissions
- ✅ Auto sync frontend/backend
- ✅ Admin có thể quản lý qua UI

**Cons:**
- ❌ Cần DB connection khi khởi động
- ❌ Cần cache strategy
- ❌ Phức tạp hơn một chút

**When to use:** Hệ thống lớn, cần flexibility

---

### Option 3: Hybrid Approach (BEST PRACTICE) 🏆

Combine cả hai: Load từ DB nhưng có fallback constants.

**Pros:**
- ✅ Flexible như Option 2
- ✅ Reliable như Option 1
- ✅ Graceful degradation
- ✅ Best of both worlds

**Cons:**
- ❌ Implementation phức tạp nhất

---

## 🚀 Implementation Plan - Option 2 (Recommended)

### Phase 1: Database Seeding

Tạo migration scripts để seed initial data.

### Phase 2: Backend Service

Tạo service để load và cache constants từ database.

### Phase 3: API Endpoints

Expose API để frontend lấy constants.

### Phase 4: Frontend Integration

Frontend gọi API khi app mount và cache trong memory.

---

## 📋 Chi tiết Implementation

### 1. Database Seeding Script

```sql
-- /backend/database/seeds/initial_permissions.sql

-- Seed Nhóm Người Dùng
INSERT INTO "NHOMNGUOIDUNG" ("MaNhom", "TenNhom") VALUES
  (1, 'Admin'),
  (2, 'Lễ tân'),
  (3, 'Quản lý'),
  (4, 'Bếp trưởng'),
  (5, 'Kế toán'),
  (6, 'Guest')
ON CONFLICT ("MaNhom") DO NOTHING;

-- Seed Chức Năng
INSERT INTO "CHUCNANG" ("MaChucNang", "TenChucNang", "TenManHinh") VALUES
  (1, 'Quản lý người dùng', 'UserScreen'),
  (2, 'Quản lý sảnh', 'HallsScreen'),
  (3, 'Quản lý món ăn', 'FoodScreen'),
  (4, 'Quản lý dịch vụ', 'ServiceScreen'),
  (5, 'Quản lý đặt tiệc', 'BookingScreen')
ON CONFLICT ("MaChucNang") DO NOTHING;

-- Seed Phân Quyền
-- Admin
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5)
ON CONFLICT DO NOTHING;

-- Lễ tân
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (2, 2), (2, 5)
ON CONFLICT DO NOTHING;

-- Quản lý
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (3, 2), (3, 3), (3, 4)
ON CONFLICT DO NOTHING;

-- Bếp trưởng
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (4, 3), (4, 5)
ON CONFLICT DO NOTHING;

-- Kế toán
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (5, 5)
ON CONFLICT DO NOTHING;

-- Guest không có quyền gì
```

### 2. Backend Permission Service

```javascript
// /backend/src/services/permission.service.js

import NhomNguoiDung from '../models/nhomnguoidung.model.js';
import ChucNang from '../models/chucnang.model.js';
import PhanQuyen from '../models/phanquyen.model.js';

class PermissionService {
  constructor() {
    this.roles = null;
    this.permissions = null;
    this.permissionMatrix = null;
    this.initialized = false;
  }

  /**
   * Load tất cả constants từ database
   */
  async initialize() {
    try {
      // Load roles
      const rolesData = await NhomNguoiDung.getAll();
      this.roles = {};
      rolesData.forEach(role => {
        const key = this.normalizeKey(role.TenNhom);
        this.roles[key] = {
          id: role.MaNhom,
          name: role.TenNhom
        };
      });

      // Load permissions
      const permissionsData = await ChucNang.getAll();
      this.permissions = {};
      permissionsData.forEach(permission => {
        const key = this.normalizeKey(permission.TenChucNang);
        this.permissions[key] = {
          id: permission.MaChucNang,
          name: permission.TenChucNang,
          screen: permission.TenManHinh
        };
      });

      // Load permission matrix
      this.permissionMatrix = {};
      const allRoles = await NhomNguoiDung.getAll();
      
      for (const role of allRoles) {
        const rolePermissions = await NhomNguoiDung.getPermissions(role.MaNhom);
        this.permissionMatrix[role.MaNhom] = rolePermissions.map(p => p.MaChucNang);
      }

      this.initialized = true;
      console.log('✅ Permission service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize permission service:', error);
      throw error;
    }
  }

  /**
   * Normalize key từ tên (Ví dụ: "Quản lý người dùng" -> "QUAN_LY_NGUOI_DUNG")
   */
  normalizeKey(name) {
    return name
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/Đ/g, 'D')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');
  }

  /**
   * Lấy roles
   */
  getRoles() {
    if (!this.initialized) {
      throw new Error('Permission service not initialized');
    }
    return this.roles;
  }

  /**
   * Lấy permissions
   */
  getPermissions() {
    if (!this.initialized) {
      throw new Error('Permission service not initialized');
    }
    return this.permissions;
  }

  /**
   * Lấy permission matrix
   */
  getPermissionMatrix() {
    if (!this.initialized) {
      throw new Error('Permission service not initialized');
    }
    return this.permissionMatrix;
  }

  /**
   * Kiểm tra quyền
   */
  hasPermission(maNhom, maChucNang) {
    if (!this.initialized) {
      throw new Error('Permission service not initialized');
    }
    
    const rolePermissions = this.permissionMatrix[maNhom] || [];
    return rolePermissions.includes(maChucNang);
  }

  /**
   * Refresh cache từ database
   */
  async refresh() {
    await this.initialize();
  }
}

// Singleton instance
export const permissionService = new PermissionService();

export default permissionService;
```

### 3. Backend API Endpoints

```javascript
// /backend/src/routes/system.routes.js

import express from 'express';
import { permissionService } from '../services/permission.service.js';

const router = express.Router();

/**
 * GET /api/system/roles
 * Lấy danh sách roles
 */
router.get('/roles', (req, res) => {
  try {
    const roles = permissionService.getRoles();
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/system/permissions
 * Lấy danh sách permissions
 */
router.get('/permissions', (req, res) => {
  try {
    const permissions = permissionService.getPermissions();
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/system/permission-matrix
 * Lấy ma trận phân quyền
 */
router.get('/permission-matrix', (req, res) => {
  try {
    const matrix = permissionService.getPermissionMatrix();
    res.json({
      success: true,
      data: matrix
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/system/refresh-permissions
 * Refresh permission cache
 * Chỉ Admin
 */
router.post('/refresh-permissions', async (req, res) => {
  try {
    await permissionService.refresh();
    res.json({
      success: true,
      message: 'Permissions refreshed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
```

### 4. App Initialization

```javascript
// /backend/app.js (hoặc server.js)

import express from 'express';
import { permissionService } from './src/services/permission.service.js';
import systemRoutes from './src/routes/system.routes.js';

const app = express();

// Middleware setup...

// Initialize permission service
await permissionService.initialize();

// Routes
app.use('/api/system', systemRoutes);
// ... other routes

export default app;
```

### 5. Frontend Service

```javascript
// /frontend/src/services/permissionService.js

class PermissionService {
  constructor() {
    this.roles = null;
    this.permissions = null;
    this.permissionMatrix = null;
  }

  /**
   * Load constants từ backend API
   */
  async initialize() {
    try {
      const [rolesRes, permsRes, matrixRes] = await Promise.all([
        fetch('http://localhost:3000/api/system/roles'),
        fetch('http://localhost:3000/api/system/permissions'),
        fetch('http://localhost:3000/api/system/permission-matrix')
      ]);

      const rolesData = await rolesRes.json();
      const permsData = await permsRes.json();
      const matrixData = await matrixRes.json();

      this.roles = rolesData.data;
      this.permissions = permsData.data;
      this.permissionMatrix = matrixData.data;

      // Cache vào localStorage để sử dụng offline
      localStorage.setItem('app_roles', JSON.stringify(this.roles));
      localStorage.setItem('app_permissions', JSON.stringify(this.permissions));
      localStorage.setItem('app_permission_matrix', JSON.stringify(this.permissionMatrix));

      console.log('✅ Permissions loaded from backend');
    } catch (error) {
      console.error('Failed to load permissions from backend, using cache', error);
      
      // Fallback to cache
      this.roles = JSON.parse(localStorage.getItem('app_roles') || '{}');
      this.permissions = JSON.parse(localStorage.getItem('app_permissions') || '{}');
      this.permissionMatrix = JSON.parse(localStorage.getItem('app_permission_matrix') || '{}');
    }
  }

  hasPermission(maNhom, permissionKey) {
    if (!this.permissionMatrix) return false;
    
    const rolePerms = this.permissionMatrix[maNhom] || [];
    const permission = this.permissions[permissionKey];
    
    return permission && rolePerms.includes(permission.id);
  }

  getRoleName(maNhom) {
    const role = Object.values(this.roles || {}).find(r => r.id === maNhom);
    return role ? role.name : 'Unknown';
  }
}

export const permissionServiceInstance = new PermissionService();
export default permissionServiceInstance;
```

### 6. Frontend App Initialization

```javascript
// /frontend/src/App.jsx

import { useEffect, useState } from 'react';
import permissionService from './services/permissionService';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await permissionService.initialize();
      setIsReady(true);
    };

    initApp();
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    // Your app routes...
  );
}
```

---

## 🔄 Migration Path

### Step 1: Run seeding script
```bash
psql -U username -d database_name -f backend/database/seeds/initial_permissions.sql
```

### Step 2: Verify data
```bash
psql -U username -d database_name -f backend/database/scripts/check_permissions_data.sql
```

### Step 3: Deploy backend changes
- Add permission service
- Add system routes
- Initialize service on app start

### Step 4: Deploy frontend changes
- Add permission service
- Load on app mount
- Update permission checks to use service

### Step 5: Test thoroughly
- Test với mỗi role
- Test offline mode (cache)
- Test permission refresh

---

## 📊 Comparison Table

| Aspect | Magic Numbers | Database-Driven | Hybrid |
|--------|--------------|-----------------|--------|
| Setup Complexity | ⭐ Simple | ⭐⭐⭐ Complex | ⭐⭐⭐⭐ Very Complex |
| Performance | ⭐⭐⭐⭐⭐ Instant | ⭐⭐⭐⭐ Fast (cached) | ⭐⭐⭐⭐ Fast |
| Flexibility | ⭐ Low | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐⭐⭐ High |
| Maintainability | ⭐⭐ Hard | ⭐⭐⭐⭐ Easy | ⭐⭐⭐ Medium |
| Offline Support | ⭐⭐⭐⭐⭐ Full | ⭐⭐ Cache only | ⭐⭐⭐⭐ Good |
| Admin Control | ❌ No | ✅ Yes | ✅ Yes |

---

## ✅ Recommendation

**Cho project Everlasting**: Nên dùng **Option 2 (Database-Driven)**

**Lý do:**
1. Hệ thống đã có RBAC trong database
2. Có models và routes sẵn
3. Admin cần quản lý permissions qua UI
4. Dễ scale khi thêm roles/permissions mới
5. Single source of truth

**Quick Win:** Implement database seeding script trước, sau đó từ từ refactor code để load từ DB.

---

## 📞 Next Steps

1. ✅ Review database structure (DONE - có đầy đủ tables)
2. 🔄 Create seeding script
3. 🔄 Implement backend permission service
4. 🔄 Add system API endpoints
5. 🔄 Update frontend to use API
6. 🔄 Test thoroughly
7. 🔄 Document API

Bạn muốn tôi implement solution nào?
