# Database-Driven Permissions - Testing Guide

## 🎯 Implementation Complete! (Updated)

Hệ thống đã được chuyển đổi hoàn toàn từ **magic numbers** sang **database-driven approach** cho cả Backend và Frontend.

### ✅ Backend Migration Complete
- ❌ Không còn hardcode constants trong `/backend/src/constants/permissions.js`
- ✅ Load từ database qua `permissionService`
- ✅ Export Proxy objects để maintain backward compatibility
- ✅ Tất cả routes đã chuyển sang import từ service

### ✅ Frontend Migration Complete  
- ✅ Load constants từ backend API `/system/constants`
- ✅ Cache trong localStorage với fallback
- ✅ Permission-based UI rendering
- ✅ Route protection

---

## 📋 Quick Start

### 1. Seed Database

Chạy seeding script để khởi tạo dữ liệu:

```bash
# Connect to your database và run:
cd backend
psql -U your_username -d your_database -f database/seeds/initial_permissions.sql
```

Hoặc nếu dùng Supabase, copy nội dung file và chạy trong SQL Editor.

### 2. Start Backend

```bash
cd backend
npm start
```

Backend sẽ tự động load permissions từ database khi khởi động.

Expected output:
```
🔧 Initializing services...
🔄 Initializing permission service from database...
✅ Permission service initialized successfully
   - Roles: 6
   - Permissions: 5
   - Permission matrix loaded for 6 roles
🚀 Server running on http://localhost:3000
🔐 Permission service: Ready
```

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ tự động gọi API để load permissions khi app khởi động.

Expected console output:
```
🚀 Initializing app...
🔄 Loading system constants from backend...
✅ System constants loaded successfully
   - Roles: 6
   - Permissions: 5
```

---

## 🧪 Testing

### Test 1: Verify Backend API

```bash
# Test system constants endpoint
curl http://localhost:3000/api/system/constants

# Expected response:
{
  "success": true,
  "data": {
    "roles": {
      "ADMIN": { "id": 1, "name": "Admin" },
      "LE_TAN": { "id": 2, "name": "Lễ tân" },
      ...
    },
    "permissions": {
      "QUAN_LY_NGUOI_DUNG": { "id": 1, "name": "Quản lý người dùng" },
      "QUAN_LY_SANH": { "id": 2, "name": "Quản lý sảnh" },
      ...
    },
    "permissionMatrix": {
      "1": [1, 2, 3, 4, 5],
      "2": [2, 5],
      ...
    }
  }
}
```

### Test 2: Check Permission Service Health

```bash
curl http://localhost:3000/api/system/health

# Expected:
{
  "success": true,
  "data": {
    "service": "permission",
    "status": "ready",
    "timestamp": "2025-12-23T..."
  }
}
```

### Test 3: Frontend Permission Loading

1. Mở DevTools Console
2. Refresh trang
3. Kiểm tra console logs:
   - ✅ "System constants loaded successfully"
   - Không có errors

### Test 4: Permission-Based UI

Login với các user có role khác nhau và verify menu items:

#### Guest (MaNhom = 6):
- ✅ Thấy: Trang Chủ
- ❌ KHÔNG thấy: Quản lý, Đặt tiệc, Thống kê, Phân quyền

#### Lễ tân (MaNhom = 2):
- ✅ Thấy: Trang Chủ, Quản lý (chỉ Sảnh), Đặt tiệc, Thống kê
- ❌ KHÔNG thấy: Phân quyền

#### Admin (MaNhom = 1):
- ✅ Thấy: TẤT CẢ menu items
- ✅ Dropdown "Quản lý" có: Sảnh, Thực đơn, Dịch vụ, Hóa đơn
- ✅ Thấy: Đặt tiệc, Thống kê, Phân quyền

### Test 5: Route Protection

Thử truy cập trực tiếp URL khi không có quyền:

```
# Login as Guest (MaNhom = 6)
# Thử truy cập: http://localhost:5173/management
# Expected: Redirect về /home
```

---

## 🔍 Verify Database Data

Chạy check script để xem data hiện tại:

```bash
psql -U your_username -d your_database -f backend/database/scripts/check_permissions_data.sql
```

Expected output:
```
=== NHÓM NGƯỜI DÙNG ===
 MaNhom | TenNhom
--------+----------
      1 | Admin
      2 | Lễ tân
      3 | Quản lý
      4 | Bếp trưởng
      5 | Kế toán
      6 | Guest

=== CHỨC NĂNG ===
 MaChucNang |      TenChucNang       | TenManHinh
------------+------------------------+-------------
          1 | Quản lý người dùng     | UserScreen
          2 | Quản lý sảnh           | HallsScreen
          3 | Quản lý món ăn         | FoodScreen
          4 | Quản lý dịch vụ        | ServiceScreen
          5 | Quản lý đặt tiệc       | BookingScreen

=== PHÂN QUYỀN ===
 MaNhom | TenNhom    | MaChucNang | TenChucNang
--------+------------+------------+----------------------
      1 | Admin      |          1 | Quản lý người dùng
      1 | Admin      |          2 | Quản lý sảnh
      1 | Admin      |          3 | Quản lý món ăn
      1 | Admin      |          4 | Quản lý dịch vụ
      1 | Admin      |          5 | Quản lý đặt tiệc
      2 | Lễ tân     |          2 | Quản lý sảnh
      2 | Lễ tân     |          5 | Quản lý đặt tiệc
      ...
```

---

## 🔄 Refresh Permissions Cache

Nếu admin thay đổi permissions trong database, refresh cache:

### Backend:
```bash
curl -X POST http://localhost:3000/api/system/refresh-permissions \
  -H "Authorization: Bearer <admin_token>"
```

### Frontend:
Refresh page hoặc:
```javascript
// In browser console
await permissionService.refresh();
```

---

## 🐛 Troubleshooting

### Problem: "Permission service not initialized"

**Solution:**
1. Check backend logs - service phải initialize thành công
2. Verify database connection
3. Check seeding script đã chạy chưa

### Problem: Frontend shows "Failed to load constants"

**Solution:**
1. Check backend đang chạy: `curl http://localhost:3000/api/system/health`
2. Check CORS settings trong backend
3. Check browser console for fetch errors
4. Frontend sẽ fallback to localStorage cache nếu có

### Problem: Menu items không ẩn đúng

**Solution:**
1. Check localStorage có cached constants chưa
2. Refresh page để reload constants
3. Verify user.maNhom đúng trong localStorage
4. Check console logs xem permission check

### Problem: Database không có data

**Solution:**
```bash
# Re-run seeding script
psql -U username -d database -f backend/database/seeds/initial_permissions.sql
```

---

## 📊 API Endpoints Reference

### Public Endpoints (No Auth Required):

- `GET /api/system/roles` - Lấy danh sách roles
- `GET /api/system/permissions` - Lấy danh sách permissions
- `GET /api/system/permission-matrix` - Lấy ma trận phân quyền
- `GET /api/system/constants` - Lấy tất cả (RECOMMENDED)
- `GET /api/system/health` - Health check

### Protected Endpoints (Auth Required):

- `GET /api/system/my-permissions` - Lấy permissions của user hiện tại
- `POST /api/system/check-permission` - Kiểm tra quyền
- `POST /api/system/refresh-permissions` - Refresh cache (Admin only)

---

## 📝 Migration Checklist

- [x] ✅ Created seeding script
- [x] ✅ Created backend permission service
- [x] ✅ Created system API routes
- [x] ✅ Registered routes in index.js
- [x] ✅ Initialize service in index.js
- [x] ✅ Created frontend permission service
- [x] ✅ Updated permissions.js to use service
- [x] ✅ Updated App.jsx to initialize service
- [x] ✅ Updated Header.jsx to use numeric IDs
- [x] ✅ Updated WithPermission.jsx to use service
- [ ] 🔄 Run seeding script on database
- [ ] 🔄 Test backend startup
- [ ] 🔄 Test frontend loading
- [ ] 🔄 Test permission-based UI
- [ ] 🔄 Test route protection

---

## 🎉 Benefits

### Before (Magic Numbers):
```javascript
// Hardcoded
const ROLES = { ADMIN: 1, LE_TAN: 2, ... };
const PERMISSIONS = { MANAGE_HALLS: 'manage_halls', ... };
const ROLE_PERMISSIONS = { 1: [...], 2: [...], ... };

// Phải maintain ở 2 nơi (backend + frontend)
// Không flexible
```

### After (Database-Driven):
```javascript
// Load from database
await permissionService.initialize();
const ROLES = permissionService.ROLES;
const PERMISSIONS = permissionService.PERMISSIONS;

// Single source of truth
// Easy to add new roles/permissions
// Admin có thể quản lý qua UI
```

---

## 🚀 Next Steps

1. **Run seeding script** ✨
2. **Test thoroughly** 🧪
3. **Update documentation** 📚
4. **Train team** 👥
5. **Consider adding:**
   - UI for admin to manage permissions
   - Audit log for permission changes
   - Role templates
   - Dynamic permission loading (real-time updates)

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs (backend console + browser console)
2. Verify database data
3. Check API endpoints với curl/Postman
4. Clear localStorage và refresh
5. Restart backend service

Good luck! 🎊
