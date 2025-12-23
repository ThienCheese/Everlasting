# Postman Examples - Sảnh (Hall) API

## 🎯 Base URL
```
http://localhost:3000/api/sanh
```

## 📋 Table of Contents
1. [Create Hall](#1-create-hall)
2. [Get All Halls](#2-get-all-halls)
3. [Get Hall Details](#3-get-hall-details)
4. [Update Hall](#4-update-hall)
5. [Delete Hall](#5-delete-hall)

---

## 1. Create Hall

### Request
**Method:** `POST`  
**URL:** `http://localhost:3000/api/sanh/create`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Body (JSON):**

### ✅ Example 1: Full data
```json
{
  "tenSanh": "Sảnh Hoa Lan",
  "maLoaiSanh": 1,
  "soLuongBanToiDa": 50,
  "ghiChu": "Sảnh VIP tầng 2, có ban công view sông, phù hợp tiệc cưới 300-500 khách",
  "anhURL": "https://example.com/images/sanh-hoa-lan.jpg"
}
```

### ✅ Example 2: Minimal data (without optional fields)
```json
{
  "tenSanh": "Sảnh Hoa Hồng",
  "maLoaiSanh": 2,
  "soLuongBanToiDa": 30
}
```

### ✅ Example 3: Small hall
```json
{
  "tenSanh": "Sảnh Orchid",
  "maLoaiSanh": 1,
  "soLuongBanToiDa": 20,
  "ghiChu": "Sảnh nhỏ, thích hợp cho tiệc gia đình"
}
```

### ✅ Example 4: Large hall
```json
{
  "tenSanh": "Sảnh Grand Ballroom",
  "maLoaiSanh": 3,
  "soLuongBanToiDa": 150,
  "ghiChu": "Sảnh lớn nhất, tầng 5, view toàn cảnh thành phố",
  "anhURL": "https://storage.example.com/halls/grand-ballroom.jpg"
}
```

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Tao sanh thanh cong",
  "data": {
    "MaSanh": 12,
    "TenSanh": "Sảnh Hoa Lan",
    "MaLoaiSanh": 1,
    "SoLuongBanToiDa": 50,
    "GhiChu": "Sảnh VIP tầng 2, có ban công view sông, phù hợp tiệc cưới 300-500 khách",
    "AnhURL": "https://example.com/images/sanh-hoa-lan.jpg",
    "DaXoa": false
  },
  "statusCode": 201
}
```

### Error Responses

#### ❌ 400 - Missing required field
```json
{
  "success": false,
  "message": "Ten sanh la bat buoc",
  "statusCode": 400
}
```

#### ❌ 400 - Invalid data type
```json
{
  "success": false,
  "message": "Ma loai sanh phai la so",
  "statusCode": 400
}
```

#### ❌ 400 - Validation failed
```json
{
  "success": false,
  "message": "Ten sanh phai co it nhat 2 ky tu, So luong ban toi da phai lon hon 0",
  "statusCode": 400
}
```

#### ❌ 401 - No authentication
```json
{
  "success": false,
  "message": "Token khong hop le hoac da het han",
  "statusCode": 401
}
```

#### ❌ 403 - No permission
```json
{
  "success": false,
  "message": "Ban khong co quyen truy cap chuc nang nay",
  "statusCode": 403
}
```

#### ❌ 500 - Duplicate name
```json
{
  "success": false,
  "message": "Sanh voi ten 'Sảnh Hoa Lan' da ton tai",
  "statusCode": 500
}
```

#### ❌ 500 - Invalid MaLoaiSanh
```json
{
  "success": false,
  "message": "Loai sanh voi ma 999 khong ton tai",
  "statusCode": 500
}
```

---

## 2. Get All Halls

### Request
**Method:** `GET`  
**URL:** `http://localhost:3000/api/sanh/lists`

**Query Parameters (Optional):**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Examples:**
```
GET http://localhost:3000/api/sanh/lists
GET http://localhost:3000/api/sanh/lists?page=1&limit=20
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Note:** ⚠️ No authentication required

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Lay danh sach thanh cong",
  "data": [
    {
      "MaSanh": 1,
      "TenSanh": "Sảnh Hoa Lan",
      "MaLoaiSanh": 1,
      "SoLuongBanToiDa": 50,
      "GhiChu": "Sảnh VIP tầng 2",
      "AnhURL": "https://example.com/images/sanh-hoa-lan.jpg",
      "DaXoa": false,
      "TenLoaiSanh": "Sảnh VIP",
      "DonGiaBanToiThieu": 500000
    },
    {
      "MaSanh": 2,
      "TenSanh": "Sảnh Hoa Hồng",
      "MaLoaiSanh": 2,
      "SoLuongBanToiDa": 30,
      "GhiChu": null,
      "AnhURL": null,
      "DaXoa": false,
      "TenLoaiSanh": "Sảnh Tiêu Chuẩn",
      "DonGiaBanToiThieu": 300000
    }
  ],
  "statusCode": 200
}
```

---

## 3. Get Hall Details

### Request
**Method:** `GET`  
**URL:** `http://localhost:3000/api/sanh/details/:id`

**Example:**
```
GET http://localhost:3000/api/sanh/details/1
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Note:** ⚠️ No authentication required

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Lay danh sach sanh thanh cong",
  "data": {
    "MaSanh": 1,
    "TenSanh": "Sảnh Hoa Lan",
    "MaLoaiSanh": 1,
    "SoLuongBanToiDa": 50,
    "GhiChu": "Sảnh VIP tầng 2, có ban công view sông",
    "AnhURL": "https://example.com/images/sanh-hoa-lan.jpg",
    "DaXoa": false,
    "TenLoaiSanh": "Sảnh VIP",
    "DonGiaBanToiThieu": 500000
  },
  "statusCode": 200
}
```

### Error Response

#### ❌ 404 - Not found
```json
{
  "success": false,
  "message": "Sanh khong ton tai",
  "statusCode": 404
}
```

---

## 4. Update Hall

### Request
**Method:** `PUT`  
**URL:** `http://localhost:3000/api/sanh/update/:id`

**Example:**
```
PUT http://localhost:3000/api/sanh/update/1
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Body (JSON):**

### ✅ Example 1: Update all fields
```json
{
  "tenSanh": "Sảnh Hoa Lan Premium",
  "maLoaiSanh": 1,
  "soLuongBanToiDa": 60,
  "ghiChu": "Đã nâng cấp thêm 10 bàn, view đẹp hơn",
  "anhURL": "https://example.com/images/sanh-hoa-lan-v2.jpg"
}
```

### ✅ Example 2: Update only some fields
```json
{
  "soLuongBanToiDa": 55,
  "ghiChu": "Tăng capacity từ 50 lên 55 bàn"
}
```

### ✅ Example 3: Change hall type
```json
{
  "maLoaiSanh": 3,
  "ghiChu": "Nâng cấp lên loại VIP Plus"
}
```

### ✅ Example 4: Update image only
```json
{
  "anhURL": "https://cdn.example.com/halls/hoa-lan-new-photo.jpg"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Cap nhat sanh thanh cong",
  "data": {
    "MaSanh": 1,
    "TenSanh": "Sảnh Hoa Lan Premium",
    "MaLoaiSanh": 1,
    "SoLuongBanToiDa": 60,
    "GhiChu": "Đã nâng cấp thêm 10 bàn, view đẹp hơn",
    "AnhURL": "https://example.com/images/sanh-hoa-lan-v2.jpg",
    "DaXoa": false
  },
  "statusCode": 200
}
```

### Error Responses

#### ❌ 400 - Validation error
```json
{
  "success": false,
  "message": "So luong ban toi da phai lon hon 0",
  "statusCode": 400
}
```

#### ❌ 401 - No authentication
```json
{
  "success": false,
  "message": "Token khong hop le hoac da het han",
  "statusCode": 401
}
```

#### ❌ 403 - No permission
```json
{
  "success": false,
  "message": "Ban khong co quyen truy cap chuc nang nay",
  "statusCode": 403
}
```

#### ❌ 404 - Hall not found
```json
{
  "success": false,
  "message": "Sanh khong ton tai",
  "statusCode": 404
}
```

#### ❌ 500 - Duplicate name
```json
{
  "success": false,
  "message": "Sanh voi ten 'Sảnh Hoa Hồng' da ton tai",
  "statusCode": 500
}
```

---

## 5. Delete Hall

### Request
**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/sanh/delete/:id`

**Example:**
```
DELETE http://localhost:3000/api/sanh/delete/5
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** This is a soft delete (sets `DaXoa = true`)

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Xoa sanh thanh cong",
  "data": {
    "id": 1
  },
  "statusCode": 200
}
```

### Error Responses

#### ❌ 401 - No authentication
```json
{
  "success": false,
  "message": "Token khong hop le hoac da het han",
  "statusCode": 401
}
```

#### ❌ 403 - No permission
```json
{
  "success": false,
  "message": "Ban khong co quyen truy cap chuc nang nay",
  "statusCode": 403
}
```

#### ❌ 404 - Hall not found
```json
{
  "success": false,
  "message": "Sanh khong ton tai",
  "statusCode": 404
}
```

#### ❌ 500 - Hall in use (has bookings)
```json
{
  "success": false,
  "message": "Khong the xoa sanh co dat tiec chua hoan thanh",
  "statusCode": 500
}
```

---

## 🔐 Authentication & Authorization

### Getting Access Token

**Step 1: Login**
```http
POST http://localhost:3000/api/nguoidung/login
Content-Type: application/json

{
  "tenDangNhap": "admin",
  "matKhau": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Step 2: Use Token**
Copy the `accessToken` and add to Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Required Permissions

For endpoints that require authentication:

| Endpoint | Method | Required Permission | Allowed Roles |
|----------|--------|-------------------|---------------|
| `/create` | POST | QUAN_LY_SANH | Admin, Lễ tân, Quản lý |
| `/lists` | GET | None | Public |
| `/details/:id` | GET | None | Public |
| `/update/:id` | PUT | QUAN_LY_SANH | Admin, Lễ tân, Quản lý |
| `/delete/:id` | DELETE | QUAN_LY_SANH | Admin, Lễ tân, Quản lý |

---

## 📊 Test Data Setup

### Required: LOAISANH records must exist

Before creating halls, ensure you have hall types in database:

```sql
-- Example LOAISANH data
INSERT INTO "LOAISANH" ("TenLoaiSanh", "DonGiaBanToiThieu", "DaXoa") VALUES
('Sảnh VIP', 500000, false),
('Sảnh Tiêu Chuẩn', 300000, false),
('Sảnh VIP Plus', 800000, false);
```

### Create Test Halls

Use these complete examples for different scenarios:

**Scenario 1: Wedding hall (large)**
```json
{
  "tenSanh": "Sảnh Tiệc Cưới Hoàng Gia",
  "maLoaiSanh": 3,
  "soLuongBanToiDa": 100,
  "ghiChu": "Sảnh cưới cao cấp, tầng 6, view sông, có sân khấu lớn",
  "anhURL": "https://example.com/halls/wedding-royal.jpg"
}
```

**Scenario 2: Corporate event hall (medium)**
```json
{
  "tenSanh": "Sảnh Sự Kiện Doanh Nghiệp",
  "maLoaiSanh": 2,
  "soLuongBanToiDa": 50,
  "ghiChu": "Có projector, micro, hệ thống âm thanh chuyên nghiệp",
  "anhURL": "https://example.com/halls/corporate.jpg"
}
```

**Scenario 3: Small family party (small)**
```json
{
  "tenSanh": "Sảnh Tiệc Gia Đình",
  "maLoaiSanh": 1,
  "soLuongBanToiDa": 15,
  "ghiChu": "Ấm cúng, phù hợp 5-7 bàn, sinh nhật, thôi nôi",
  "anhURL": "https://example.com/halls/family.jpg"
}
```

---

## 🧪 Postman Collection

You can import this collection into Postman:

1. Create a new Collection: "Everlasting - Sanh API"
2. Add environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `access_token`: (get from login)
3. Create requests as documented above
4. Use `{{base_url}}` and `{{access_token}}` variables

---

**Last Updated:** December 23, 2025  
**API Version:** 1.0.0
