# 🔐 CÁCH KIỂM TRA QUYỀN THEO MaNhom

## 📊 TỔNG QUAN

Sau khi đồng bộ database, hệ thống phân quyền hoạt động như sau:

### Database Structure:
```
CHUCNANG (Permissions)
├── MaChucNang (ID số)
├── TenChucNang (Tên tiếng Việt) ← Hiển thị trong UI
└── TenManHinh (Screen name) ← Dùng cho routing

NHOMNGUOIDUNG (Roles)
├── MaNhom (ID số)
└── TenNhom (Tên nhóm)

PHANQUYEN (Permission Matrix)
├── MaNhom (Role ID)
└── MaChucNang (Permission ID)
```

---

## 🎯 CÁCH KIỂM TRA QUYỀN

### 1. Backend - requirePermission Middleware

**File:** `backend/src/middleware/auth.middleware.js`

#### Cách sử dụng:
```javascript
// Import middleware
import { authMiddleware, requirePermission } from '../middleware/auth.middleware.js';

// Áp dụng trong route
router.get('/invoice-management', 
  authMiddleware,           // Bước 1: Check authentication (JWT)
  requirePermission(6),     // Bước 2: Check permission MaChucNang = 6
  InvoiceController.getAll  // Bước 3: Handler nếu pass
);
```

#### Logic kiểm tra:
```javascript
export const requirePermission = (maChucNang) => {
  return async (req, res, next) => {
    try {
      // Load permission service
      await permissionService.initialize();
      
      // Lấy MaNhom từ token JWT
      const userRole = req.user.maNhom;  // Từ authMiddleware
      
      // Kiểm tra permission từ database
      const hasPermission = permissionService.hasPermission(userRole, maChucNang);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập chức năng này'
        });
      }
      
      next();  // Pass → Tiếp tục handler
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra quyền'
      });
    }
  };
};
```

#### Query thực tế:
```sql
-- permissionService.hasPermission(maNhom, maChucNang)
-- Kiểm tra xem user có quyền không

SELECT COUNT(*) as count
FROM "PHANQUYEN" 
WHERE "MaNhom" = :userRole 
  AND "MaChucNang" = :requiredPermission;

-- Nếu count > 0 → có quyền
-- Nếu count = 0 → không có quyền
```

#### Ví dụ cụ thể:

**Case 1: Kế toán truy cập Invoice (MaNhom=5, MaChucNang=6)**
```javascript
// Request: GET /api/invoice-management
// JWT token: { maNhom: 5 }

requirePermission(6) → permissionService.hasPermission(5, 6)
→ Query: SELECT COUNT(*) FROM PHANQUYEN WHERE MaNhom=5 AND MaChucNang=6
→ Result: 1 (có trong database)
→ hasPermission = true
→ next() → Handler chạy ✅
```

**Case 2: Bếp trưởng truy cập Invoice (MaNhom=4, MaChucNang=6)**
```javascript
// Request: GET /api/invoice-management
// JWT token: { maNhom: 4 }

requirePermission(6) → permissionService.hasPermission(4, 6)
→ Query: SELECT COUNT(*) FROM PHANQUYEN WHERE MaNhom=4 AND MaChucNang=6
→ Result: 0 (không có trong database)
→ hasPermission = false
→ Return 403 Forbidden ❌
```

---

### 2. Frontend - WithPermission HOC (Route Protection)

**File:** `frontend/src/components/WithPermission.jsx`

#### Cách sử dụng:
```jsx
import WithPermission from './components/WithPermission';
import { PERMISSIONS } from './utils/permissions';

// Wrap component trong route
<Route path="/invoice-management" element={
  <ProtectedRoute>
    <WithPermission requiredPermissions={6}>
      <InvoiceManagement />
    </WithPermission>
  </ProtectedRoute>
} />
```

#### Logic kiểm tra:
```jsx
const WithPermission = ({ 
  children, 
  requiredPermissions,  // Số hoặc array: 6 hoặc [2,3,4]
  requireAll = false,   // true: cần tất cả quyền, false: chỉ cần 1 quyền
  fallbackPath = '/'    // Redirect nếu không có quyền
}) => {
  // Lấy role từ localStorage/context
  const userRole = authUtils.getUserRole();  // Ví dụ: 5 (Kế toán)
  
  let hasAccess = false;
  
  if (Array.isArray(requiredPermissions)) {
    // Check multiple permissions
    hasAccess = requireAll 
      ? permissionService.hasAllPermissions(userRole, requiredPermissions)
      : permissionService.hasAnyPermission(userRole, requiredPermissions);
  } else {
    // Check single permission
    hasAccess = permissionService.hasPermission(userRole, requiredPermissions);
  }
  
  // Redirect nếu không có quyền
  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Render component nếu có quyền
  return children;
};
```

#### permissionService.hasPermission():
```javascript
// File: frontend/src/services/permissionService.js

hasPermission(maNhom, maChucNang) {
  // Lấy từ cache (localStorage)
  const rolePermissions = this.permissionMatrix[maNhom] || [];
  
  // Check xem maChucNang có trong array không
  return rolePermissions.includes(maChucNang);
}

// Example cache:
// this.permissionMatrix = {
//   "1": [1, 2, 3, 4, 5, 6],  // Admin: ALL
//   "4": [],                  // Bếp trưởng: NONE
//   "5": [6]                  // Kế toán: QUAN_LY_HOA_DON
// }
```

#### Ví dụ cụ thể:

**Case 1: Kế toán navigate to /invoice-management**
```jsx
// User: { maNhom: 5 }
// Route: <WithPermission requiredPermissions={6}>

→ userRole = 5
→ permissionService.hasPermission(5, 6)
→ permissionMatrix[5] = [6]
→ [6].includes(6) = true
→ hasAccess = true
→ Render <InvoiceManagement /> ✅
```

**Case 2: Bếp trưởng navigate to /invoice-management**
```jsx
// User: { maNhom: 4 }
// Route: <WithPermission requiredPermissions={6}>

→ userRole = 4
→ permissionService.hasPermission(4, 6)
→ permissionMatrix[4] = []
→ [].includes(6) = false
→ hasAccess = false
→ <Navigate to="/" replace /> ❌
```

---

### 3. Frontend - canAccess() Function (Menu Display)

**File:** `frontend/src/components/Header.jsx`

#### Cách sử dụng:
```jsx
const Header = () => {
  const userRole = authUtils.getUserRole();
  
  // Function kiểm tra quyền
  const canAccess = (maChucNang) => {
    if (!userRole) return false;
    return permissionService.hasPermission(userRole, maChucNang);
  };
  
  return (
    <nav>
      {/* Menu chỉ hiện nếu có quyền */}
      {canAccess(6) && (
        <li onClick={() => navigate('/invoice-management')}>
          Quản lý hóa đơn
        </li>
      )}
      
      {/* Dropdown hiện nếu có ít nhất 1 quyền */}
      {(canAccess(2) || canAccess(3) || canAccess(4) || canAccess(6)) && (
        <li className="dropdown">
          <div>Quản lý ▼</div>
          <ul>
            {canAccess(2) && <li>Quản lý sảnh</li>}
            {canAccess(3) && <li>Quản lý món ăn</li>}
            {canAccess(4) && <li>Quản lý dịch vụ</li>}
            {canAccess(6) && <li>Quản lý hóa đơn</li>}
          </ul>
        </li>
      )}
    </nav>
  );
};
```

#### Ví dụ cụ thể:

**Case 1: Kế toán (MaNhom=5)**
```jsx
// permissionMatrix[5] = [6]

canAccess(2) → false ❌ → Menu "Quản lý sảnh" không hiện
canAccess(3) → false ❌ → Menu "Quản lý món ăn" không hiện
canAccess(4) → false ❌ → Menu "Quản lý dịch vụ" không hiện
canAccess(6) → true  ✅ → Menu "Quản lý hóa đơn" HIỆN

// Dropdown condition:
(false || false || false || true) = true ✅
→ Dropdown "Quản lý" HIỆN
→ Bên trong chỉ có "Quản lý hóa đơn"
```

**Case 2: Bếp trưởng (MaNhom=4)**
```jsx
// permissionMatrix[4] = []

canAccess(2) → false ❌
canAccess(3) → false ❌
canAccess(4) → false ❌
canAccess(6) → false ❌

// Dropdown condition:
(false || false || false || false) = false ❌
→ Dropdown "Quản lý" KHÔNG HIỆN
→ Không có menu nào hiển thị
```

**Case 3: Admin (MaNhom=1)**
```jsx
// permissionMatrix[1] = [1,2,3,4,5,6]

canAccess(1) → true ✅
canAccess(2) → true ✅
canAccess(3) → true ✅
canAccess(4) → true ✅
canAccess(5) → true ✅
canAccess(6) → true ✅

→ TẤT CẢ menu đều hiển thị
```

---

## 📋 BẢNG MA TRẬN PHÂN QUYỀN

### Permission Matrix trong Database:

| MaNhom | TenNhom | MaChucNang có quyền |
|--------|---------|---------------------|
| 1 | Admin | [1, 2, 3, 4, 5, 6] |
| 2 | Nhân viên tư vấn | [5] |
| 3 | Nhân viên kho | [] |
| 4 | Bếp trưởng | [] |
| 5 | Kế toán | [6] |
| 6 | Guest | [] |

### Permission Details:

| MaChucNang | TenChucNang | TenManHinh | Roles có quyền |
|------------|-------------|------------|----------------|
| 1 | Quản lý người dùng | UserScreen | Admin |
| 2 | Quản lý sảnh | HallScreen | Admin |
| 3 | Quản lý món ăn | FoodScreen | Admin |
| 4 | Quản lý dịch vụ | ServiceScreen | Admin |
| 5 | Quản lý đặt tiệc | BookingScreen | Admin, Nhân viên tư vấn |
| 6 | Quản lý hóa đơn | InvoiceScreen | Admin, Kế toán |

---

## 🔄 FLOW HOÀN CHỈNH

### User Access Flow:

```
1. USER LOGIN
   ↓
2. JWT Token issued với { maNhom: 5 } (Kế toán)
   ↓
3. Frontend load permissions từ /api/system/constants
   → permissionMatrix[5] = [6]
   → Cache vào localStorage
   ↓
4. RENDER MENU
   → canAccess(6) = true
   → Menu "Quản lý hóa đơn" hiển thị ✅
   ↓
5. USER CLICK MENU
   → navigate('/invoice-management')
   ↓
6. ROUTE PROTECTION (Frontend)
   → <WithPermission requiredPermissions={6}>
   → hasPermission(5, 6) = true
   → Render component ✅
   ↓
7. API CALL (Backend)
   → GET /api/invoice-management
   → authMiddleware: Verify JWT ✅
   → requirePermission(6): Check PHANQUYEN table
   → Query: SELECT * FROM PHANQUYEN WHERE MaNhom=5 AND MaChucNang=6
   → Found → Permission granted ✅
   ↓
8. RETURN DATA
   → Component receives data
   → User sees invoice management page ✅
```

---

## 🐛 DEBUGGING TIPS

### Check Permission Matrix từ Database:
```sql
-- Xem tất cả permissions của 1 role
SELECT 
  cn."TenChucNang",
  cn."TenManHinh"
FROM "PHANQUYEN" pq
JOIN "CHUCNANG" cn ON pq."MaChucNang" = cn."MaChucNang"
WHERE pq."MaNhom" = 5;  -- Kế toán

-- Xem role nào có permission cụ thể
SELECT 
  nn."TenNhom",
  nn."MaNhom"
FROM "PHANQUYEN" pq
JOIN "NHOMNGUOIDUNG" nn ON pq."MaNhom" = nn."MaNhom"
WHERE pq."MaChucNang" = 6;  -- Quản lý hóa đơn
```

### Check Frontend Permission Cache:
```javascript
// Browser console
const ps = window.permissionService;

// Check matrix
console.log(ps.getPermissionMatrix());
// Output: { "1": [1,2,3,4,5,6], "5": [6], ... }

// Check specific permission
console.log(ps.hasPermission(5, 6));  // true or false

// Clear cache and reload
localStorage.removeItem('permissionMatrix');
window.location.reload();
```

### Check Backend Permission:
```bash
# Test API với curl
curl -X POST http://localhost:5000/api/system/check-permission \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"maChucNang": 6}'
```

---

## ✅ BEST PRACTICES

### 1. Always use MaChucNang (ID) for permission checks
```javascript
// ✅ GOOD
canAccess(6)
requirePermission(6)
<WithPermission requiredPermissions={6}>

// ❌ BAD (don't use role IDs or string names)
if (userRole === 5)  // Hardcode role check
canAccess('QUAN_LY_HOA_DON')  // String name
```

### 2. Backend validates EVERY request
```javascript
// ✅ GOOD - Always use requirePermission
router.get('/invoice', 
  authMiddleware,
  requirePermission(6),  // Backend validation
  handler
);

// ❌ BAD - Không có permission check
router.get('/invoice', authMiddleware, handler);
```

### 3. Frontend provides good UX
```jsx
// ✅ GOOD - Hide menu if no permission
{canAccess(6) && <MenuItem>Quản lý hóa đơn</MenuItem>}

// ❌ BAD - Show menu but error on click
<MenuItem onClick={...}>Quản lý hóa đơn</MenuItem>
// → User clicks → 403 error → Bad UX
```

### 4. Keep frontend cache in sync
```javascript
// ✅ GOOD - Reload permissions after login
await permissionService.initialize();

// ✅ GOOD - Clear cache on logout
localStorage.removeItem('permissionMatrix');

// ❌ BAD - Never update cache
// → User sees old permissions after role change
```

---

## 🎯 KẾT LUẬN

Hệ thống kiểm tra quyền hoạt động ở **3 tầng**:

1. **Menu Display** - `canAccess()` ẩn/hiện menu items
2. **Route Protection** - `WithPermission` HOC redirect nếu không có quyền
3. **API Protection** - `requirePermission()` middleware block requests

**Mỗi tầng check độc lập** để đảm bảo security:
- Frontend check → UX tốt (không thấy menu không có quyền)
- Backend check → Security (không thể bypass bằng cách gọi API trực tiếp)

**Data flow:** Database → Backend Service → API → Frontend Service → Cache → Components
