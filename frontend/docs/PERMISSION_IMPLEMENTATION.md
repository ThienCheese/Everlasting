# Permission System Implementation - Summary

## 📦 Files Created/Modified

### Created Files:

1. **`/frontend/src/utils/permissions.js`**
   - Permission management utility
   - ROLES và PERMISSIONS constants
   - Ma trận phân quyền (ROLE_PERMISSIONS)
   - Helper functions: hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, etc.

2. **`/frontend/src/components/WithPermission.jsx`**
   - HOC component để bảo vệ routes theo permissions
   - Auto redirect về /home nếu không có quyền

3. **`/frontend/src/components/AccessDenied.jsx`**
   - Component hiển thị khi user truy cập trang không có quyền
   - UI đẹp với animation

4. **`/frontend/src/components/AccessDenied.css`**
   - Styling cho AccessDenied component

5. **`/frontend/docs/PERMISSION_SYSTEM.md`**
   - Documentation đầy đủ về permission system
   - Hướng dẫn sử dụng, best practices, examples

### Modified Files:

1. **`/frontend/src/components/Header.jsx`**
   - Import permissionsUtils và PERMISSIONS
   - Thêm logic ẩn/hiện menu items dựa trên quyền
   - Dropdown "Quản lý" chỉ hiện khi có ít nhất 1 quyền quản lý
   - Các menu items được filter theo permissions

2. **`/frontend/src/App.jsx`**
   - Import WithPermission và PERMISSIONS
   - Wrap các routes với WithPermission
   - Mỗi route được bảo vệ bởi permission tương ứng

---

## 🎯 Ma Trận Phân Quyền

| Tính năng | Route | Permission | Admin | Lễ tân | Quản lý | Bếp trưởng | Kế toán | Guest |
|-----------|-------|------------|:-----:|:------:|:-------:|:----------:|:-------:|:-----:|
| Trang chủ | `/home` | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quản lý sảnh | `/management` | `MANAGE_HALLS` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Quản lý thực đơn | `/menu-management` | `MANAGE_DISHES` | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Quản lý dịch vụ | `/service-management` | `MANAGE_SERVICES` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Quản lý hóa đơn | `/invoice-management` | `MANAGE_INVOICES` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Đặt tiệc | `/booking` | `MANAGE_BOOKINGS` | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Thống kê | `/stats` | `VIEW_STATISTICS` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Phân quyền | `/roles` | `MANAGE_PERMISSIONS` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🔧 How It Works

### 1. Header Menu - Conditional Rendering

```javascript
// Chỉ hiển thị dropdown "Quản lý" nếu có ít nhất 1 quyền
{(canAccess(PERMISSIONS.MANAGE_HALLS) || 
  canAccess(PERMISSIONS.MANAGE_DISHES) || 
  canAccess(PERMISSIONS.MANAGE_SERVICES) ||
  canAccess(PERMISSIONS.MANAGE_INVOICES)) && (
  <li className="dropdown">
    <div>Quản lý</div>
    <ul>
      {canAccess(PERMISSIONS.MANAGE_HALLS) && <li>Quản lý sảnh</li>}
      {canAccess(PERMISSIONS.MANAGE_DISHES) && <li>Quản lý thực đơn</li>}
      {canAccess(PERMISSIONS.MANAGE_SERVICES) && <li>Quản lý dịch vụ</li>}
      {canAccess(PERMISSIONS.MANAGE_INVOICES) && <li>Quản lý hóa đơn</li>}
    </ul>
  </li>
)}

// Đặt tiệc - Chỉ hiện cho Admin, Lễ tân, Bếp trưởng, Kế toán
{canAccess(PERMISSIONS.MANAGE_BOOKINGS) && (
  <li onClick={() => navigate('/booking')}>Đặt tiệc</li>
)}

// Phân quyền - Chỉ Admin
{canAccess(PERMISSIONS.MANAGE_PERMISSIONS) && (
  <li onClick={() => navigate('/roles')}>Phân quyền</li>
)}
```

### 2. Route Protection - WithPermission

```javascript
// App.jsx
<Route 
  path="/management" 
  element={
    <ProtectedRoute>                    {/* Check logged in */}
      <WithPermission                   {/* Check permission */}
        requiredPermissions={PERMISSIONS.MANAGE_HALLS}
        fallbackPath="/home"
      >
        <ManagementPage />
      </WithPermission>
    </ProtectedRoute>
  } 
/>
```

### 3. Permission Check Flow

```
User clicks menu item/route
    ↓
Check authentication (ProtectedRoute)
    ↓ Yes
Check permission (WithPermission)
    ↓ Yes
Show component
    ↓ No
Redirect to fallbackPath (/home)
```

---

## 🎨 UI/UX Changes

### Before:
- Tất cả user nhìn thấy tất cả menu items
- User có thể click vào tính năng không có quyền
- Route không được bảo vệ theo permissions

### After:
- **Guest**: Chỉ thấy "Trang Chủ"
- **Lễ tân**: Thấy Trang Chủ, Quản lý (Sảnh), Đặt tiệc, Thống kê
- **Quản lý**: Thấy Trang Chủ, Quản lý (Sảnh, Món ăn, Dịch vụ), Thống kê
- **Bếp trưởng**: Thấy Trang Chủ, Quản lý (Món ăn), Đặt tiệc, Thống kê
- **Kế toán**: Thấy Trang Chủ, Quản lý (Hóa đơn), Đặt tiệc, Thống kê
- **Admin**: Thấy tất cả

Menu items không có quyền sẽ **KHÔNG HIỂN THỊ** thay vì disabled.

---

## 🚀 Usage Examples

### Trong Components

```javascript
import permissionsUtils, { PERMISSIONS } from '../utils/permissions';
import authUtils from '../utils/auth';

const MyComponent = () => {
  const user = authUtils.getUser();
  const userRole = user.maNhom;
  
  // Helper function
  const canAccess = (permission) => {
    return permissionsUtils.hasPermission(userRole, permission);
  };
  
  return (
    <div>
      {canAccess(PERMISSIONS.MANAGE_HALLS) && (
        <button>Quản lý sảnh</button>
      )}
      
      {permissionsUtils.isAdmin(userRole) && (
        <button>Admin Panel</button>
      )}
    </div>
  );
};
```

### Trong Routes

```javascript
import WithPermission from './components/WithPermission';
import { PERMISSIONS } from './utils/permissions';

<Route 
  path="/special" 
  element={
    <ProtectedRoute>
      <WithPermission 
        requiredPermissions={PERMISSIONS.MANAGE_HALLS}
        fallbackPath="/home"
      >
        <SpecialPage />
      </WithPermission>
    </ProtectedRoute>
  } 
/>
```

---

## ✅ Testing Checklist

### Test với mỗi role:

#### Guest (MaNhom = 6):
- [ ] Chỉ thấy "Trang Chủ" trong menu
- [ ] Không thấy dropdown "Quản lý"
- [ ] Không thấy "Đặt tiệc", "Thống kê", "Phân quyền"
- [ ] Truy cập trực tiếp `/management` → redirect về `/home`
- [ ] Truy cập trực tiếp `/stats` → redirect về `/home`

#### Lễ tân (MaNhom = 2):
- [ ] Thấy: Trang Chủ, Quản lý (Sảnh), Đặt tiệc, Thống kê
- [ ] Không thấy: Phân quyền
- [ ] Trong dropdown "Quản lý" chỉ thấy "Quản lý sảnh"
- [ ] Có thể truy cập `/management`, `/booking`, `/stats`
- [ ] Không thể truy cập `/menu-management`, `/service-management`, `/invoice-management`, `/roles`

#### Quản lý (MaNhom = 3):
- [ ] Thấy: Trang Chủ, Quản lý (Sảnh, Thực đơn, Dịch vụ), Thống kê
- [ ] Không thấy: Đặt tiệc, Phân quyền
- [ ] Trong dropdown "Quản lý" thấy: Sảnh, Thực đơn, Dịch vụ (không có Hóa đơn)
- [ ] Có thể truy cập `/management`, `/menu-management`, `/service-management`, `/stats`
- [ ] Không thể truy cập `/booking`, `/invoice-management`, `/roles`

#### Bếp trưởng (MaNhom = 4):
- [ ] Thấy: Trang Chủ, Quản lý (Thực đơn), Đặt tiệc, Thống kê
- [ ] Trong dropdown "Quản lý" chỉ thấy "Quản lý thực đơn"
- [ ] Có thể truy cập `/menu-management`, `/booking`, `/stats`
- [ ] Không thể truy cập `/management`, `/service-management`, `/invoice-management`, `/roles`

#### Kế toán (MaNhom = 5):
- [ ] Thấy: Trang Chủ, Quản lý (Hóa đơn), Đặt tiệc, Thống kê
- [ ] Trong dropdown "Quản lý" chỉ thấy "Quản lý hóa đơn"
- [ ] Có thể truy cập `/invoice-management`, `/booking`, `/stats`
- [ ] Không thể truy cập `/management`, `/menu-management`, `/service-management`, `/roles`

#### Admin (MaNhom = 1):
- [ ] Thấy TẤT CẢ menu items
- [ ] Trong dropdown "Quản lý" thấy: Sảnh, Thực đơn, Dịch vụ, Hóa đơn
- [ ] Thấy: Đặt tiệc, Thống kê, Phân quyền
- [ ] Có thể truy cập TẤT CẢ routes

---

## 📝 Notes

1. **Security**: Frontend permission check CHỈ ẨN UI, KHÔNG phải bảo mật. Backend PHẢI validate!
2. **Token**: Khi admin cấp quyền mới, user phải **login lại** để token được cập nhật
3. **Fallback**: Khi không có quyền, user được redirect về `/home` thay vì thấy error page
4. **Performance**: User permissions được cache trong memory, không cần query lại

---

## 🔄 Future Enhancements

1. **Dynamic Permissions**: Load permissions từ API thay vì hardcode
2. **Permission Groups**: Tạo groups để dễ quản lý (e.g., MANAGEMENT_GROUP)
3. **Audit Log**: Log khi user attempt truy cập trang không có quyền
4. **Toast Notifications**: Hiển thị thông báo khi redirect do không có quyền
5. **Admin UI**: Trang quản lý permissions với drag-drop interface

---

## 📞 Contact

Nếu cần hỗ trợ hoặc thêm permissions mới, vui lòng:
1. Cập nhật `/utils/permissions.js`
2. Cập nhật ma trận trong `/docs/PERMISSION_SYSTEM.md`
3. Test với tất cả roles
4. Update API documentation nếu cần
