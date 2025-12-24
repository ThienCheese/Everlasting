# Permission System - Frontend Documentation

## 📋 Tổng quan

Hệ thống phân quyền frontend được thiết kế để ẩn/hiện các tính năng và bảo vệ routes dựa trên role của người dùng.

---

## 🔐 Roles và Permissions

### Roles (MaNhom)

| MaNhom | Tên Role | Mô tả |
|--------|----------|-------|
| 1 | Admin | Toàn quyền quản trị hệ thống |
| 2 | Lễ tân | Tiếp khách, quản lý đặt tiệc, sảnh |
| 3 | Quản lý | Giám sát sảnh, món ăn, dịch vụ |
| 4 | Bếp trưởng | Quản lý món ăn, xem đặt tiệc |
| 5 | Kế toán | Xem đặt tiệc, quản lý hóa đơn |
| 6 | Guest | Chỉ truy cập trang chủ |

### Permissions

```javascript
PERMISSIONS = {
  MANAGE_USERS: 'manage_users',           // Quản lý người dùng
  MANAGE_HALLS: 'manage_halls',           // Quản lý sảnh
  MANAGE_DISHES: 'manage_dishes',         // Quản lý món ăn
  MANAGE_SERVICES: 'manage_services',     // Quản lý dịch vụ
  MANAGE_BOOKINGS: 'manage_bookings',     // Quản lý đặt tiệc
  MANAGE_INVOICES: 'manage_invoices',     // Quản lý hóa đơn
  VIEW_STATISTICS: 'view_statistics',     // Thống kê
  MANAGE_PERMISSIONS: 'manage_permissions' // Phân quyền
}
```

---

## 🎯 Ma Trận Phân Quyền

| Permission | Admin | Lễ tân | Quản lý | Bếp trưởng | Kế toán | Guest |
|-----------|:-----:|:------:|:-------:|:----------:|:-------:|:-----:|
| Quản lý người dùng | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý sảnh | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Quản lý món ăn | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Quản lý dịch vụ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Đặt tiệc | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Quản lý hóa đơn | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Thống kê | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Phân quyền | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🛠️ Sử dụng Permission Utils

### Import

```javascript
import permissionsUtils, { PERMISSIONS, ROLES } from '../utils/permissions';
```

### Kiểm tra quyền đơn lẻ

```javascript
const user = authUtils.getUser();
const userRole = user.maNhom;

// Kiểm tra có quyền quản lý sảnh
const canManageHalls = permissionsUtils.hasPermission(userRole, PERMISSIONS.MANAGE_HALLS);

if (canManageHalls) {
  // Hiển thị button/menu item
}
```

### Kiểm tra một trong nhiều quyền

```javascript
// User có ít nhất 1 trong các quyền này
const canAccessManagement = permissionsUtils.hasAnyPermission(
  userRole, 
  [PERMISSIONS.MANAGE_HALLS, PERMISSIONS.MANAGE_DISHES, PERMISSIONS.MANAGE_SERVICES]
);
```

### Kiểm tra tất cả quyền

```javascript
// User phải có tất cả các quyền
const canAccessSpecialFeature = permissionsUtils.hasAllPermissions(
  userRole,
  [PERMISSIONS.MANAGE_BOOKINGS, PERMISSIONS.MANAGE_INVOICES]
);
```

### Kiểm tra Admin

```javascript
const isUserAdmin = permissionsUtils.isAdmin(userRole);
```

---

## 🎨 Ẩn/Hiện UI Components

### Trong JSX Components

```javascript
import React from 'react';
import authUtils from '../utils/auth';
import permissionsUtils, { PERMISSIONS } from '../utils/permissions';

const MyComponent = () => {
  const user = authUtils.getUser();
  const userRole = user.maNhom;
  
  return (
    <div>
      {/* Hiển thị cho tất cả */}
      <h1>Trang chủ</h1>
      
      {/* Chỉ hiển thị nếu có quyền quản lý sảnh */}
      {permissionsUtils.hasPermission(userRole, PERMISSIONS.MANAGE_HALLS) && (
        <button onClick={handleManageHalls}>Quản lý sảnh</button>
      )}
      
      {/* Chỉ hiển thị cho Admin */}
      {permissionsUtils.isAdmin(userRole) && (
        <button onClick={handleAdminPanel}>Admin Panel</button>
      )}
    </div>
  );
};
```

### Ẩn/Hiện Menu Items

```javascript
// Ví dụ trong Header.jsx
const canAccess = (permission) => {
  return permissionsUtils.hasPermission(userRole, permission);
};

<ul className="nav-links">
  {/* Trang chủ - Hiển thị cho tất cả */}
  <li onClick={() => navigate('/home')}>Trang Chủ</li>
  
  {/* Dropdown quản lý - Chỉ hiện nếu có ít nhất 1 quyền quản lý */}
  {(canAccess(PERMISSIONS.MANAGE_HALLS) || 
    canAccess(PERMISSIONS.MANAGE_DISHES) || 
    canAccess(PERMISSIONS.MANAGE_SERVICES)) && (
    <li className="dropdown">
      <span>Quản lý</span>
      <ul>
        {canAccess(PERMISSIONS.MANAGE_HALLS) && (
          <li onClick={() => navigate('/management')}>Quản lý sảnh</li>
        )}
        {canAccess(PERMISSIONS.MANAGE_DISHES) && (
          <li onClick={() => navigate('/menu-management')}>Quản lý món ăn</li>
        )}
      </ul>
    </li>
  )}
</ul>
```

---

## 🔒 Bảo vệ Routes

### Sử dụng WithPermission Component

```javascript
import WithPermission from '../components/WithPermission';
import { PERMISSIONS } from '../utils/permissions';

// Trong App.jsx
<Routes>
  {/* Route yêu cầu quyền cụ thể */}
  <Route 
    path="/management" 
    element={
      <ProtectedRoute>
        <WithPermission requiredPermissions={PERMISSIONS.MANAGE_HALLS}>
          <ManagementPage />
        </WithPermission>
      </ProtectedRoute>
    } 
  />
  
  {/* Route yêu cầu một trong nhiều quyền */}
  <Route 
    path="/management-overview" 
    element={
      <ProtectedRoute>
        <WithPermission 
          requiredPermissions={[
            PERMISSIONS.MANAGE_HALLS,
            PERMISSIONS.MANAGE_DISHES,
            PERMISSIONS.MANAGE_SERVICES
          ]}
          requireAll={false}
        >
          <ManagementOverview />
        </WithPermission>
      </ProtectedRoute>
    } 
  />
  
  {/* Route yêu cầu tất cả permissions */}
  <Route 
    path="/special-feature" 
    element={
      <ProtectedRoute>
        <WithPermission 
          requiredPermissions={[
            PERMISSIONS.MANAGE_BOOKINGS,
            PERMISSIONS.MANAGE_INVOICES
          ]}
          requireAll={true}
        >
          <SpecialFeature />
        </WithPermission>
      </ProtectedRoute>
    } 
  />
</Routes>
```

### WithPermission Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | React.Element | ✅ | - | Component cần bảo vệ |
| `requiredPermissions` | string \| string[] | ✅ | - | Permission(s) cần thiết |
| `requireAll` | boolean | ❌ | `false` | Nếu true, cần tất cả permissions |
| `fallbackPath` | string | ❌ | `'/home'` | Redirect path khi không có quyền |

---

## 📝 Best Practices

### 1. Luôn kiểm tra quyền ở cả Frontend và Backend

```javascript
// Frontend - Ẩn UI
{canAccess(PERMISSIONS.DELETE_USER) && (
  <button onClick={handleDelete}>Xóa</button>
)}

// Backend vẫn phải kiểm tra quyền trong API
```

### 2. Sử dụng helper functions

```javascript
// Tạo helper function trong component
const canAccess = (permission) => {
  return permissionsUtils.hasPermission(userRole, permission);
};

// Sử dụng trong JSX
{canAccess(PERMISSIONS.MANAGE_HALLS) && <Button />}
```

### 3. Kết hợp ProtectedRoute và WithPermission

```javascript
// Luôn wrap trong ProtectedRoute trước
<Route 
  path="/protected" 
  element={
    <ProtectedRoute>           {/* Check authentication */}
      <WithPermission requiredPermissions={PERMISSIONS.ADMIN}> {/* Check authorization */}
        <AdminPage />
      </WithPermission>
    </ProtectedRoute>
  } 
/>
```

### 4. Hiển thị thông báo phù hợp

```javascript
// Thay vì im lặng ẩn tính năng, có thể hiển thị disabled button với tooltip
<Tooltip title="Bạn không có quyền truy cập tính năng này">
  <span>
    <button 
      disabled={!canAccess(PERMISSIONS.MANAGE_HALLS)}
      onClick={handleManage}
    >
      Quản lý sảnh
    </button>
  </span>
</Tooltip>
```

### 5. Xử lý trường hợp không có user data

```javascript
const user = authUtils.getUser();

// Luôn có fallback
const userRole = user?.maNhom || ROLES.GUEST;

// Hoặc early return
if (!user) {
  return <Navigate to="/" />;
}
```

---

## 🎬 Ví dụ thực tế

### Ví dụ 1: Management Page với nhiều actions

```javascript
import React from 'react';
import authUtils from '../utils/auth';
import permissionsUtils, { PERMISSIONS } from '../utils/permissions';

const ManagementPage = () => {
  const user = authUtils.getUser();
  const userRole = user.maNhom;
  
  const canCreate = permissionsUtils.hasPermission(userRole, PERMISSIONS.MANAGE_HALLS);
  const canEdit = permissionsUtils.hasPermission(userRole, PERMISSIONS.MANAGE_HALLS);
  const canDelete = permissionsUtils.isAdmin(userRole); // Chỉ Admin mới xóa được
  
  return (
    <div>
      <h1>Quản lý Sảnh</h1>
      
      <div className="actions">
        {canCreate && (
          <button onClick={handleCreate}>Tạo mới</button>
        )}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Tên sảnh</th>
            <th>Số bàn</th>
            {(canEdit || canDelete) && <th>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {halls.map(hall => (
            <tr key={hall.id}>
              <td>{hall.name}</td>
              <td>{hall.tables}</td>
              {(canEdit || canDelete) && (
                <td>
                  {canEdit && (
                    <button onClick={() => handleEdit(hall.id)}>Sửa</button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(hall.id)}>Xóa</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Ví dụ 2: Dashboard với widgets theo role

```javascript
const Dashboard = () => {
  const user = authUtils.getUser();
  const userRole = user.maNhom;
  
  return (
    <div className="dashboard">
      {/* Widget cho tất cả user */}
      <Widget title="Tổng quan" />
      
      {/* Widget cho Lễ tân và Admin */}
      {permissionsUtils.hasAnyPermission(userRole, [
        PERMISSIONS.MANAGE_BOOKINGS,
        PERMISSIONS.MANAGE_HALLS
      ]) && (
        <Widget title="Đặt tiệc hôm nay" />
      )}
      
      {/* Widget chỉ cho Kế toán và Admin */}
      {permissionsUtils.hasPermission(userRole, PERMISSIONS.MANAGE_INVOICES) && (
        <Widget title="Doanh thu" />
      )}
      
      {/* Widget chỉ cho Admin */}
      {permissionsUtils.isAdmin(userRole) && (
        <Widget title="Quản lý hệ thống" />
      )}
    </div>
  );
};
```

---

## 🔍 Debugging

### Hiển thị permissions của user hiện tại

```javascript
const DebugPermissions = () => {
  const user = authUtils.getUser();
  const userPermissions = permissionsUtils.getUserPermissions(user.maNhom);
  
  return (
    <div style={{padding: '20px', background: '#f5f5f5'}}>
      <h3>Debug Info</h3>
      <p><strong>User:</strong> {user.username}</p>
      <p><strong>Role:</strong> {permissionsUtils.getRoleName(user.maNhom)}</p>
      <p><strong>MaNhom:</strong> {user.maNhom}</p>
      <p><strong>Permissions:</strong></p>
      <ul>
        {userPermissions.map(perm => (
          <li key={perm}>{perm}</li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 🚀 Testing

### Test permission logic

```javascript
// Test hasPermission
const testPermissions = () => {
  console.log('Admin có quyền MANAGE_HALLS:', 
    permissionsUtils.hasPermission(ROLES.ADMIN, PERMISSIONS.MANAGE_HALLS)
  ); // true
  
  console.log('Guest có quyền MANAGE_HALLS:', 
    permissionsUtils.hasPermission(ROLES.GUEST, PERMISSIONS.MANAGE_HALLS)
  ); // false
  
  console.log('Lễ tân có quyền MANAGE_BOOKINGS:', 
    permissionsUtils.hasPermission(ROLES.LE_TAN, PERMISSIONS.MANAGE_BOOKINGS)
  ); // true
};
```

---

## ⚠️ Lưu ý

1. **Security**: Frontend permission check chỉ để UX, KHÔNG phải bảo mật. Backend PHẢI validate quyền.
2. **Token refresh**: Khi user được cấp quyền mới, phải login lại để token được cập nhật.
3. **Fallback**: Luôn có fallback cho trường hợp user data không tồn tại.
4. **Performance**: Cache user data thay vì gọi `authUtils.getUser()` nhiều lần.

---

## 📞 Support

Nếu cần thêm permission hoặc role mới:
1. Thêm vào `PERMISSIONS` constant trong `/utils/permissions.js`
2. Cập nhật `ROLE_PERMISSIONS` matrix
3. Cập nhật documentation này
4. Test kỹ lưỡng trước khi deploy
