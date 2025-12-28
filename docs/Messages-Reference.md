# Messages Reference - Hệ Thống Quản Lý Tiệc Cưới Everlasting

## 📋 Mục Lục
1. [Authentication Messages](#1-authentication-messages)
2. [Dish Management Messages](#2-dish-management-messages)
3. [Menu Management Messages](#3-menu-management-messages)
4. [Booking Management Messages](#4-booking-management-messages)
5. [Invoice Management Messages](#5-invoice-management-messages)
6. [Report Management Messages](#6-report-management-messages)
7. [User Management Messages](#7-user-management-messages)
8. [Permission Messages](#8-permission-messages)
9. [Validation Error Messages](#9-validation-error-messages)
10. [System Error Messages](#10-system-error-messages)

---

## 1. AUTHENTICATION MESSAGES

### Success Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Đăng nhập thành công` | Success | Login successful | Toast notification |
| `Đăng xuất thành công` | Success | Logout successful | Toast notification |
| `Token đã được làm mới` | Success | Token refresh | Console (background) |

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tên đăng nhập hoặc mật khẩu không đúng` | Error | Invalid credentials | Alert dialog |
| `Vui lòng nhập đầy đủ thông tin` | Error | Empty username/password | Alert dialog |
| `Không thể kết nối đến server` | Error | Backend offline | Alert dialog |
| `Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại` | Error | Token expired (refresh failed) | Toast + redirect |
| `Token không hợp lệ` | Error | Invalid JWT | API response |
| `Người dùng không tồn tại` | Error | User not found | API response |

**Related Files:**
- Frontend: `src/pages/login.jsx`
- Backend: `src/controller/nguoidung.controller.js`

---

## 2. DISH MANAGEMENT MESSAGES

### Success Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tạo món ăn thành công` | Success | Dish created | Toast notification |
| `Cập nhật món ăn thành công` | Success | Dish updated | Toast notification |
| `Xóa món ăn thành công` | Success | Dish deleted | Toast notification |
| `Khôi phục món ăn thành công` | Success | Dish restored | Toast notification |

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tên món ăn đã tồn tại` | Error | Duplicate dish name | Alert dialog |
| `Loại món ăn không tồn tại` | Error | Invalid dish category | Alert dialog |
| `Món ăn không tồn tại` | Error | Dish not found | Alert dialog |
| `Món ăn đang được sử dụng trong đặt tiệc, không thể xóa` | Error | Dish in use (unpaid bookings) | Alert dialog |
| `Tên món ăn phải có ít nhất 2 ký tự` | Error | Name too short | Alert dialog |
| `Đơn giá phải lớn hơn hoặc bằng 0` | Error | Invalid price | Alert dialog |
| `Đơn giá phải là số` | Error | Price not a number | Alert dialog |

**Related Files:**
- Frontend: `src/pages/MenuManagement.jsx`
- Backend: `src/controller/monan.controller.js`
- Service: `src/services/monan.services.js`

**Example Request/Response:**
```javascript
// Success
POST /api/monan/create
Response: {
  "success": true,
  "message": "Tạo món ăn thành công",
  "data": { "MaMonAn": 25, ... }
}

// Error
Response: {
  "success": false,
  "message": "Tên món ăn đã tồn tại",
  "error": "DUPLICATE_DISH_NAME"
}
```

---

## 3. MENU MANAGEMENT MESSAGES

### Success Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tạo thực đơn mẫu thành công` | Success | Template menu created | Toast notification |
| `Cập nhật thực đơn mẫu thành công` | Success | Template menu updated | Toast notification |
| `Xóa thực đơn mẫu thành công` | Success | Template menu deleted | Toast notification |
| `Thêm món ăn vào thực đơn mẫu thành công` | Success | Dish added to menu | Toast notification |
| `Xóa món ăn khỏi thực đơn mẫu thành công` | Success | Dish removed from menu | Toast notification |

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tên thực đơn đã tồn tại` | Error | Duplicate menu name | Alert dialog |
| `Thực đơn mẫu không tồn tại` | Error | Menu not found | Alert dialog |
| `Món ăn đã tồn tại trong thực đơn mẫu` | Error | Dish already in menu | Alert dialog |
| `Món ăn không có trong thực đơn mẫu` | Error | Dish not in menu (remove) | Alert dialog |
| `Thực đơn mẫu đang được sử dụng, không thể xóa` | Error | Menu in use | Alert dialog |

**Related Files:**
- Frontend: `src/pages/MenuManagement.jsx`
- Backend: `src/controller/thucdonmau.controller.js`
- Model: `src/models/thucdonmau.model.js`

---

## 4. BOOKING MANAGEMENT MESSAGES

### Success Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tạo đặt tiệc thành công` | Success | Booking created | Toast notification |
| `Cập nhật đặt tiệc thành công` | Success | Booking updated | Toast notification |
| `Hủy đặt tiệc thành công` | Success | Booking cancelled | Toast notification |
| `Thêm dịch vụ thành công` | Success | Service added to booking | Toast notification |
| `Xóa dịch vụ thành công` | Success | Service removed from booking | Toast notification |

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Ca không tồn tại` | Error | Invalid shift | Alert dialog |
| `Sảnh không tồn tại` | Error | Invalid hall | Alert dialog |
| `Thực đơn không tồn tại` | Error | Invalid menu | Alert dialog |
| `Sảnh đã được đặt vào thời gian này` | Error | Booking conflict | Alert dialog |
| `Số lượng bàn vượt quá số bàn tối đa của sảnh` | Error | Exceed max tables | Alert dialog |
| `Tiền đặt cọc phải >= 15% tổng tiền dự kiến` | Error | Insufficient deposit | Alert dialog |
| `Giá bàn (${giaBan}) phải >= đơn giá tối thiểu (${donGiaMin})` | Error | Below min table price | Alert dialog |
| `Đặt tiệc không tồn tại` | Error | Booking not found | Alert dialog |
| `Đặt tiệc đã có hóa đơn, không thể sửa` | Error | Booking has invoice | Alert dialog |
| `Đặt tiệc đã bị hủy` | Error | Booking cancelled | Alert dialog |
| `Ngày đại tiệc phải là ngày trong tương lai` | Error | Invalid date (past) | Alert dialog |
| `Số lượng bàn phải lớn hơn 0` | Error | Invalid table count | Alert dialog |

**Related Files:**
- Frontend: `src/pages/ManagerBooking.jsx`
- Backend: `src/controller/dattiec.controller.js`
- Service: `src/services/dattiec.services.js`
- Middleware: `src/middleware/validations/validateDatTiec.js`

**Example Validation Errors:**
```javascript
// Conflict Error
POST /api/dattiec/create
Response: {
  "success": false,
  "message": "Sảnh đã được đặt vào thời gian này",
  "error": "BOOKING_CONFLICT",
  "details": {
    "ngayDaiTiec": "2025-02-14",
    "maCa": 3,
    "maSanh": 2
  }
}

// Deposit Error
Response: {
  "success": false,
  "message": "Tiền đặt cọc phải >= 15% tổng tiền dự kiến",
  "error": "INSUFFICIENT_DEPOSIT",
  "details": {
    "tienDatCoc": 20000000,
    "required": 30000000,
    "tongTienDuKien": 200000000
  }
}

// Table Count Error
Response: {
  "success": false,
  "message": "Số lượng bàn vượt quá số bàn tối đa của sảnh",
  "error": "EXCEED_MAX_TABLES",
  "details": {
    "soLuongBan": 28,
    "soBanDuTru": 5,
    "total": 33,
    "max": 30
  }
}
```

---

## 5. INVOICE MANAGEMENT MESSAGES

### Success Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tạo hóa đơn thành công` | Success | Invoice created | Toast notification |
| `Cập nhật hóa đơn thành công` | Success | Invoice updated | Toast notification |
| `Thanh toán hóa đơn thành công` | Success | Invoice paid | Toast notification |
| `Xóa hóa đơn thành công` | Success | Invoice deleted | Toast notification |

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Đặt tiệc không tồn tại` | Error | Invalid booking | Alert dialog |
| `Đặt tiệc này đã có hóa đơn` | Error | Invoice already exists | Alert dialog |
| `Hóa đơn không tồn tại` | Error | Invoice not found | Alert dialog |
| `Hóa đơn đã được thanh toán, không thể sửa` | Error | Invoice already paid | Alert dialog |
| `Ngày thanh toán không hợp lệ` | Error | Invalid payment date | Alert dialog |
| `Hóa đơn chưa được thanh toán` | Error | Invoice not paid | Alert dialog |

### Info Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `⚠️ Thanh toán trễ ${soNgay} ngày` | Warning | Late payment | Invoice detail |
| `Phạt (${phanTram}% x ${soNgay} ngày): +${tienPhat} đ` | Info | Penalty calculation | Invoice detail |
| `Áp dụng quy định phạt` | Info | Penalty rule applied | Checkbox label |

**Related Files:**
- Frontend: `src/pages/InvoiceManagement.jsx`
- Backend: `src/controller/hoadon.controller.js`
- Service: `src/services/hoadon.services.js`

**Example Invoice Response:**
```javascript
POST /api/hoadon/create
Response: {
  "success": true,
  "message": "Tạo hóa đơn thành công",
  "data": {
    "MaHoaDon": 8,
    "TongTienBan": 189000000,
    "TongTienDichVu": 16000000,
    "TongTienHoaDon": 205000000,
    "ApDungQuyDinhPhat": true,
    "PhanTramPhatMotNgay": 1.0,
    "TongTienPhat": 6150000,
    "TongTienConLai": 161150000,
    "TrangThai": 0
  }
}
```

---

## 6. REPORT MANAGEMENT MESSAGES

### Success Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tạo báo cáo doanh số thành công` | Success | Report generated | Toast notification |
| `Xuất báo cáo thành công` | Success | Report exported | Toast notification |

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Báo cáo không tồn tại` | Error | Report not found | Alert dialog |
| `Báo cáo tháng này đã tồn tại` | Error | Report already exists | Alert dialog |
| `Không có dữ liệu để tạo báo cáo` | Error | No invoices in month | Alert dialog |
| `Tháng không hợp lệ (1-12)` | Error | Invalid month | Alert dialog |
| `Năm không hợp lệ` | Error | Invalid year | Alert dialog |

### Info Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Báo cáo chưa tồn tại` | Info | No report yet | Page content |
| `Tổng doanh thu tháng: ${amount} đ` | Info | Total revenue | Report header |
| `Ngày có doanh thu cao nhất: ${date}` | Info | Peak day | Report summary |

**Related Files:**
- Frontend: `src/pages/Stats.jsx`
- Backend: `src/controller/baocaodoanhso.controller.js`
- Service: `src/services/baocaodoanhso.services.js`

**Example Report Response:**
```javascript
GET /api/baocaodoanhso/thang/2/nam/2025
Response: {
  "success": true,
  "message": "Lấy báo cáo thành công",
  "data": {
    "MaBaoCaoDoanhSo": 5,
    "Thang": 2,
    "Nam": 2025,
    "TongDoanhThu": 534710000,
    "chiTiet": [
      {
        "Ngay": "2025-02-14",
        "SoLuongTiec": 2,
        "DoanhThu": 352910000,
        "TiLe": "66.00"
      },
      ...
    ]
  }
}
```

---

## 7. USER MANAGEMENT MESSAGES

### Success Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tạo người dùng thành công` | Success | User created | Toast notification |
| `Cập nhật người dùng thành công` | Success | User updated | Toast notification |
| `Xóa người dùng thành công` | Success | User deleted | Toast notification |
| `Đổi mật khẩu thành công` | Success | Password changed | Toast notification |

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Tên đăng nhập đã tồn tại` | Error | Duplicate username | Alert dialog |
| `Người dùng không tồn tại` | Error | User not found | Alert dialog |
| `Mật khẩu phải có ít nhất 6 ký tự` | Error | Password too short | Alert dialog |
| `Mật khẩu cũ không đúng` | Error | Incorrect old password | Alert dialog |
| `Nhóm người dùng không tồn tại` | Error | Invalid role | Alert dialog |
| `Không thể xóa người dùng đang đăng nhập` | Error | Delete self | Alert dialog |
| `Không thể xóa admin cuối cùng` | Error | Delete last admin | Alert dialog |

**Related Files:**
- Frontend: `src/pages/UserManagement.jsx`
- Backend: `src/controller/nguoidung.controller.js`

---

## 8. PERMISSION MESSAGES

### Error Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Bạn không có quyền truy cập chức năng này` | Error | No permission | Toast + redirect |
| `Ban khong co quyen truy cap chuc nang nay` | Error | No permission (backend) | API response |
| `Phiên đăng nhập không hợp lệ` | Error | Invalid session | Toast + redirect |

### Info Messages

| Message | Type | Context | Display Location |
|---------|------|---------|------------------|
| `Quyền: ${permissionName}` | Info | Permission label | UI |
| `Bạn đang xem với quyền: ${roleName}` | Info | Current role | Header |

**Related Files:**
- Frontend: `src/components/WithPermission.jsx`
- Backend: `src/middleware/authorization.middleware.js`

**Permission Error Response:**
```javascript
POST /api/monan/create
Response: {
  "success": false,
  "message": "Ban khong co quyen truy cap chuc nang nay",
  "error": "FORBIDDEN",
  "requiredPermission": "QUAN_LY_MON_AN",
  "userRole": "Kế toán"
}
```

---

## 9. VALIDATION ERROR MESSAGES

### Common Validation Errors

| Message | Type | Field | Validation Rule |
|---------|------|-------|-----------------|
| `"${field}" is required` | Error | Any | Required field empty |
| `"${field}" must be a number` | Error | Numeric | Non-numeric input |
| `"${field}" must be a string` | Error | Text | Non-string input |
| `"${field}" must be a valid date` | Error | Date | Invalid date format |
| `"${field}" must be greater than 0` | Error | Numeric | Value <= 0 |
| `"${field}" length must be at least ${min} characters` | Error | String | Too short |
| `"${field}" length must be less than or equal to ${max} characters` | Error | String | Too long |
| `"${field}" must be a valid email` | Error | Email | Invalid email format |
| `"${field}" must be a valid phone number` | Error | Phone | Invalid phone format |

### Specific Validation Messages

| Message | Field | Context |
|---------|-------|---------|
| `Tên món ăn phải có ít nhất 2 ký tự` | tenMonAn | Create dish |
| `Đơn giá phải lớn hơn hoặc bằng 0` | donGia | Create dish |
| `Số điện thoại phải có 10 số` | dienThoai | Create booking |
| `Tiền đặt cọc phải >= 15% tổng tiền` | tienDatCoc | Create booking |
| `Số lượng bàn phải lớn hơn 0` | soLuongBan | Create booking |
| `Ngày đại tiệc phải sau ngày hôm nay` | ngayDaiTiec | Create booking |

**Related Files:**
- Backend: `src/middleware/validations/*.js`

**Example Validation Error Response:**
```javascript
POST /api/monan/create
Response: {
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "tenMonAn",
      "message": "Tên món ăn phải có ít nhất 2 ký tự",
      "value": "A"
    },
    {
      "field": "donGia",
      "message": "Đơn giá phải lớn hơn hoặc bằng 0",
      "value": -100
    }
  ]
}
```

---

## 10. SYSTEM ERROR MESSAGES

### Backend Errors

| Message | HTTP Status | Context | Display Location |
|---------|-------------|---------|------------------|
| `Lỗi hệ thống, vui lòng thử lại sau` | 500 | Internal server error | Alert dialog |
| `Lỗi kết nối cơ sở dữ liệu` | 500 | Database connection error | Alert dialog |
| `Không tìm thấy tài nguyên` | 404 | Resource not found | Alert dialog |
| `Yêu cầu không hợp lệ` | 400 | Bad request | Alert dialog |
| `Quá nhiều yêu cầu, vui lòng thử lại sau` | 429 | Rate limit exceeded | Alert dialog |

### Frontend Errors

| Message | Context | Display Location |
|---------|---------|------------------|
| `Không thể kết nối đến server` | Fetch error | Alert dialog |
| `Hệ thống đang bảo trì, vui lòng thử lại sau` | Maintenance mode | Page content |
| `Đã xảy ra lỗi không xác định` | Unknown error | Alert dialog |
| `Timeout: Yêu cầu mất quá nhiều thời gian` | Request timeout | Alert dialog |

**Related Files:**
- Backend: `src/utils/response.js`
- Frontend: `src/services/api.js`

**Example System Error Response:**
```javascript
POST /api/monan/create
Response: {
  "success": false,
  "message": "Lỗi hệ thống, vui lòng thử lại sau",
  "error": "INTERNAL_SERVER_ERROR",
  "timestamp": "2025-12-28T10:30:00Z",
  "path": "/api/monan/create"
}
```

---

## MESSAGE LOCALIZATION

### Vietnamese Messages (Current)

All messages are currently in Vietnamese. Future support for English:

| Vietnamese | English (Future) |
|------------|------------------|
| `Đăng nhập thành công` | `Login successful` |
| `Tạo món ăn thành công` | `Dish created successfully` |
| `Sảnh đã được đặt vào thời gian này` | `Hall is already booked at this time` |
| `Tiền đặt cọc phải >= 15% tổng tiền dự kiến` | `Deposit must be >= 15% of total amount` |

---

## MESSAGE FORMATTING

### Currency Formatting

```javascript
// Format: "189,000,000 đ"
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
```

### Date Formatting

```javascript
// Format: "14/02/2025"
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};
```

### Percentage Formatting

```javascript
// Format: "66.00%"
const formatPercent = (value) => {
  return `${parseFloat(value).toFixed(2)}%`;
};
```

---

## TOAST NOTIFICATION TYPES

### Success (Green)
```javascript
toast.success('Tạo món ăn thành công', {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true
});
```

### Error (Red)
```javascript
toast.error('Tên món ăn đã tồn tại', {
  position: 'top-right',
  autoClose: 5000
});
```

### Warning (Orange)
```javascript
toast.warning('Thanh toán trễ 3 ngày', {
  position: 'top-right',
  autoClose: 4000
});
```

### Info (Blue)
```javascript
toast.info('Báo cáo chưa tồn tại', {
  position: 'top-right',
  autoClose: 3000
});
```

---

## ALERT DIALOG PATTERNS

### Confirmation Dialog
```javascript
const confirmed = window.confirm('Bạn có chắc chắn muốn xóa món ăn này?');
if (confirmed) {
  await deleteMonAn(maMonAn);
}
```

### Error Alert
```javascript
alert('Lỗi: Tên món ăn đã tồn tại');
```

### Success Alert
```javascript
alert('Tạo món ăn thành công!');
```

---

## ERROR CODE REFERENCE

| Code | Message | HTTP Status |
|------|---------|-------------|
| `DUPLICATE_DISH_NAME` | Tên món ăn đã tồn tại | 400 |
| `BOOKING_CONFLICT` | Sảnh đã được đặt vào thời gian này | 400 |
| `INSUFFICIENT_DEPOSIT` | Tiền đặt cọc phải >= 15% | 400 |
| `EXCEED_MAX_TABLES` | Số lượng bàn vượt quá | 400 |
| `BELOW_MIN_TABLE_PRICE` | Giá bàn < đơn giá tối thiểu | 400 |
| `UNAUTHORIZED` | Không có quyền truy cập | 401 |
| `FORBIDDEN` | Không có quyền thực hiện | 403 |
| `NOT_FOUND` | Không tìm thấy tài nguyên | 404 |
| `TOO_MANY_REQUESTS` | Quá nhiều yêu cầu | 429 |
| `INTERNAL_SERVER_ERROR` | Lỗi hệ thống | 500 |
| `DATABASE_CONNECTION_ERROR` | Lỗi kết nối database | 500 |

---

**Document Version:** 1.0  
**Date:** December 28, 2025  
**Author:** Messages Reference Team
