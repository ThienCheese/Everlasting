# Database-Driven Permissions - Implementation Summary

## ✅ HOÀN TẤT!

Hệ thống phân quyền đã được chuyển đổi từ **Magic Numbers** sang **Database-Driven Approach**.

---

## 📁 Files Created/Modified

### Backend (6 files created, 2 modified)

#### Created:
1. **`/backend/database/seeds/initial_permissions.sql`** ⭐
   - Seeding script khởi tạo dữ liệu ban đầu
   - Insert NHOMNGUOIDUNG, CHUCNANG, PHANQUYEN
   - Verify data sau khi seed

2. **`/backend/src/services/permission.service.js`** ⭐⭐⭐
   - Core service load và cache permissions từ DB
   - Singleton pattern
   - Methods: initialize, hasPermission, getRoles, getPermissions, etc.

3. **`/backend/src/routes/system.routes.js`** ⭐⭐
   - Public API endpoints để frontend lấy constants
   - GET /system/constants (RECOMMENDED)
   - GET /system/roles, /permissions, /permission-matrix
   - POST /system/refresh-permissions (Admin only)

4. **`/backend/database/scripts/check_permissions_data.sql`**
   - Query script để verify database data
   - Hiển thị roles, permissions, permission matrix

5. **`/backend/docs/CONSTANTS_VS_DATABASE.md`**
   - Phân tích chi tiết vấn đề và giải pháp
   - So sánh các approaches
   - Implementation plan

6. **`/DATABASE_DRIVEN_TESTING_GUIDE.md`**
   - Hướng dẫn testing từng bước
   - Troubleshooting guide
   - API reference

#### Modified:
1. **`/backend/src/routes/index.js`**
   - Added: `import systemRoutes from './system.routes.js';`
   - Added: `router.use('/system', systemRoutes);`

2. **`/backend/index.js`** ⭐
   - Import permissionService
   - Initialize service trước khi start server
   - Async IIFE wrapper

---

### Frontend (4 files created, 4 modified)

#### Created:
1. **`/frontend/src/services/permissionService.js`** ⭐⭐⭐
   - Frontend service gọi API để load constants
   - Cache vào localStorage
   - Methods: initialize, hasPermission, getRoleName, etc.
   - Fallback to cache nếu API fail

#### Modified:
1. **`/frontend/src/utils/permissions.js`** ⭐
   - Refactored to use permissionService
   - Maintain backward compatibility
   - Proxy objects for ROLES and PERMISSIONS

2. **`/frontend/src/App.jsx`** ⭐⭐
   - Added LoadingScreen component
   - Initialize permissionService on mount
   - Show loading state while initializing
   - Updated routes to use numeric permission IDs

3. **`/frontend/src/components/Header.jsx`** ⭐⭐
   - Import permissionService
   - canAccess() now uses numeric IDs (1, 2, 3, 4, 5)
   - Updated menu items permission checks

4. **`/frontend/src/components/WithPermission.jsx`** ⭐
   - Updated to use permissionService
   - Changed from string permissions to numeric IDs

---

## 🔑 Key Changes

### Database Constants Mapping

```sql
-- NHOMNGUOIDUNG (Roles)
1 = Admin
2 = Lễ tân
3 = Quản lý
4 = Bếp trưởng
5 = Kế toán
6 = Guest

-- CHUCNANG (Permissions)
1 = Quản lý người dùng (Admin only)
2 = Quản lý sảnh (Admin, Lễ tân, Quản lý)
3 = Quản lý món ăn (Admin, Quản lý, Bếp trưởng)
4 = Quản lý dịch vụ (Admin, Quản lý)
5 = Quản lý đặt tiệc (Admin, Lễ tân, Bếp trưởng, Kế toán)
```

### Before vs After

#### Before (Magic Numbers):
```javascript
// Frontend
const PERMISSIONS = {
  MANAGE_HALLS: 'manage_halls',
  MANAGE_DISHES: 'manage_dishes',
  ...
};

// Hardcoded matrix
const ROLE_PERMISSIONS = {
  1: ['manage_halls', 'manage_dishes', ...],
  ...
};
```

#### After (Database-Driven):
```javascript
// Backend
await permissionService.initialize(); // Load from DB

// Frontend
await permissionService.initialize(); // Load from API

// Use numeric IDs from database
canAccess(2); // Quản lý sảnh
canAccess(5); // Quản lý đặt tiệc
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      DATABASE                            │
│  NHOMNGUOIDUNG | CHUCNANG | PHANQUYEN                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ Load on startup
┌─────────────────────────────────────────────────────────┐
│            Backend Permission Service                    │
│  - Cache roles, permissions, matrix in memory           │
│  - Expose API endpoints                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ HTTP API
┌─────────────────────────────────────────────────────────┐
│          Frontend Permission Service                     │
│  - Fetch from API on app mount                          │
│  - Cache in localStorage                                │
│  - Fallback to cache if API fails                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ Use in components
┌─────────────────────────────────────────────────────────┐
│              UI Components                               │
│  Header, App routes, WithPermission                     │
│  - Check permissions: canAccess(permissionId)           │
│  - Hide/show menu items                                 │
│  - Protect routes                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Seed Database
```bash
psql -U username -d database -f backend/database/seeds/initial_permissions.sql
```

### 2. Start Backend
```bash
cd backend
npm start

# Expected:
# ✅ Permission service initialized successfully
# 🚀 Server running on http://localhost:3000
```

### 3. Start Frontend
```bash
cd frontend
npm run dev

# Browser console:
# ✅ System constants loaded successfully
```

### 4. Test
- Login with different roles
- Verify menu items show/hide correctly
- Test route protection

---

## 📊 API Endpoints

### GET /api/system/constants ⭐ RECOMMENDED
Lấy tất cả constants trong một request.

Response:
```json
{
  "success": true,
  "data": {
    "roles": { "ADMIN": { "id": 1, "name": "Admin" }, ... },
    "rolesById": { "1": { "key": "ADMIN", "name": "Admin" }, ... },
    "permissions": { "QUAN_LY_SANH": { "id": 2, "name": "Quản lý sảnh" }, ... },
    "permissionsById": { "2": { "key": "QUAN_LY_SANH", "name": "Quản lý sảnh" }, ... },
    "permissionMatrix": { "1": [1, 2, 3, 4, 5], "2": [2, 5], ... }
  }
}
```

### Other Endpoints:
- GET /api/system/roles
- GET /api/system/permissions
- GET /api/system/permission-matrix
- GET /api/system/health
- GET /api/system/my-permissions (Auth required)
- POST /api/system/refresh-permissions (Admin only)

---

## ✨ Benefits

1. **Single Source of Truth**: Database là nguồn duy nhất
2. **Flexible**: Dễ dàng thêm role/permission mới
3. **Maintainable**: Không cần sửa code khi thay đổi permissions
4. **Admin Control**: Admin có thể quản lý permissions qua UI (future)
5. **Consistent**: Frontend và Backend luôn đồng bộ
6. **Cacheable**: Performance tốt với in-memory cache
7. **Offline Support**: Frontend cache trong localStorage

---

## 🎯 Testing Checklist

- [ ] Run seeding script
- [ ] Verify database data
- [ ] Start backend → check logs
- [ ] Start frontend → check console
- [ ] Login as Guest → verify menu (chỉ Trang Chủ)
- [ ] Login as Lễ tân → verify menu (Trang Chủ, Quản lý Sảnh, Đặt tiệc, Thống kê)
- [ ] Login as Admin → verify menu (Tất cả)
- [ ] Test route protection → truy cập URL không có quyền
- [ ] Test refresh cache → POST /api/system/refresh-permissions

---

## 📝 Notes

### Temporary Solutions:
1. **Hóa đơn & Thống kê**: Chưa có trong bảng CHUCNANG
   - Tạm thời không check permission
   - Hiển thị cho tất cả users đã login (trừ Guest)
   - TODO: Thêm vào database sau

2. **Permission IDs**: Sử dụng fallback
   ```javascript
   PERMISSIONS.QUAN_LY_SANH || 2
   ```
   - Nếu service chưa initialize, dùng hardcode ID
   - Đảm bảo app không crash

### Future Enhancements:
1. UI cho Admin quản lý permissions
2. Real-time permission updates (WebSocket)
3. Permission templates
4. Audit log
5. Role hierarchy
6. Custom permissions per user

---

## 🐛 Troubleshooting

**Backend không start:**
- Check database connection
- Verify seeding script đã chạy
- Check logs for errors

**Frontend không load:**
- Check backend đang chạy
- Check CORS settings
- Clear localStorage và refresh

**Menu không ẩn đúng:**
- Check user.maNhom trong localStorage
- Verify permission matrix trong database
- Check console logs

---

## 📞 Support Files

1. **Testing Guide**: `/DATABASE_DRIVEN_TESTING_GUIDE.md`
2. **Analysis**: `/backend/docs/CONSTANTS_VS_DATABASE.md`
3. **Check Script**: `/backend/database/scripts/check_permissions_data.sql`

---

## ✅ Implementation Complete!

All files created and modified. Ready to test!

**Next Steps:**
1. Run seeding script
2. Start backend
3. Start frontend
4. Test with different roles
5. Celebrate! 🎉
