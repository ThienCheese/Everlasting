# API Documentation - Quick Reference

## Base URL
```
http://localhost:3000/api
```

---

## 👥 Nhóm Người Dùng (Roles)

| MaNhom | Tên Nhóm | Mô tả |
|--------|----------|-------|
| 1 | **Admin** | Toàn quyền quản trị hệ thống |
| 2 | **Lễ tân** | Tiếp khách, quản lý đặt tiệc, sảnh |
| 3 | **Quản lý** | Giám sát sảnh, món ăn, dịch vụ |
| 4 | **Bếp trưởng** | Quản lý món ăn, xem đặt tiệc |
| 5 | **Kế toán** | Xem đặt tiệc, quản lý hóa đơn |
| 6 | **Guest** | User mới đăng ký - Chỉ truy cập public endpoints |

> ⚠️ **Lưu ý:** User mới đăng ký sẽ tự động có role **Guest** (MaNhom = 6). Admin cần cập nhật role để cấp quyền truy cập.

---

## 🔐 Ma Trận Phân Quyền

| Chức năng | Admin | Lễ tân | Quản lý | Bếp trưởng | Kế toán | Guest |
|-----------|:-----:|:------:|:-------:|:----------:|:-------:|:-----:|
| Quản lý người dùng | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Quản lý sảnh | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Quản lý món ăn | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Quản lý dịch vụ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Quản lý đặt tiệc | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Public endpoints | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- 🔓 Public - Không cần authentication
- 🔒 Protected - Cần authentication
- 👤 Self - User chỉ có thể thao tác với dữ liệu của mình
- 🔑 Permission-based - Kiểm tra quyền theo role

---

## 0. AUTHENTICATION (NGUOIDUNG)

### Đăng ký 🔓
```http
POST /nguoidung/register
Content-Type: application/json

{
  "tenDangNhap": "string",
  "matKhau": "string",
  "tenNguoiDung": "string"
}

Response:
{
  "success": true,
  "data": {
    "MaNguoiDung": 10,
    "TenDangNhap": "newuser",
    "TenNguoiDung": "New User",
    "MaNhom": 6
  },
  "message": "Đăng ký thành công. Tài khoản của bạn có quyền Guest, vui lòng liên hệ Admin để nâng cấp quyền.",
  "statusCode": 201
}
```
**Access:** Public

**Note:** 
- ⚠️ User mới đăng ký tự động có role **Guest** (MaNhom = 6)
- 🔒 Guest chỉ có thể truy cập các public endpoints
- 👤 Liên hệ Admin để được cấp quyền cao hơn
- ❌ Không thể gửi `maNhom` trong request (bảo mật)

---

### Đăng nhập 🔓
```http
POST /nguoidung/login
Content-Type: application/json

{
  "tenDangNhap": "string",
  "matKhau": "string"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "number",
      "username": "string",
      "name": "string",
      "maNhom": "number"
    }
  }
}
```
**Access:** Public

---

### Làm mới access token 🔓
```http
POST /nguoidung/refresh
Content-Type: application/json

{
  "refreshToken": "string"
}
```
**Access:** Public

---

### Đăng xuất 🔒
```http
POST /nguoidung/logout
Authorization: Bearer <accessToken>
```
**Access:** Authenticated users only

---

### Lấy thông tin user hiện tại 🔒
```http
GET /nguoidung/me
Authorization: Bearer <accessToken>
```
**Access:** Authenticated users only

---

### Lấy tất cả users 🔑
```http
GET /nguoidung/all
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

### Cập nhật user 🔒👤
```http
PUT /nguoidung/update/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenNguoiDung": "string (optional)",
  "matKhau": "string (optional)",
  "maNhom": "number (optional)"
}
```
**Access:** Authenticated users (own profile) or Admin

---

### Xóa user 🔑
```http
DELETE /nguoidung/delete/:id
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

## 1. ĐẶT TIỆC (DATTIEC) 🎉

**Required Permission:** MaChucNang = 5 (Quản lý đặt tiệc)

**Allowed Roles:** ✅ Admin | ✅ Lễ tân | ✅ Bếp trưởng | ✅ Kế toán

---

### Lấy tất cả đặt tiệc 🔑
```http
GET /dattiec/lists
Authorization: Bearer <accessToken>
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Lấy chi tiết đặt tiệc 🔑
```http
GET /dattiec/details/:id
Authorization: Bearer <accessToken>
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Tạo đặt tiệc mới 🔑
```http
POST /dattiec/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenChuRe": "string",
  "tenCoDau": "string",
  "dienThoai": "string",
  "ngayDatTiec": "date (optional)",
  "ngayDaiTiec": "date",
  "maCa": "number",
  "maSanh": "number",
  "maThucDon": "number",
  "tienDatCoc": "number",
  "soLuongBan": "number",
  "soBanDuTru": "number (optional, default: 0)"
}
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Cập nhật đặt tiệc 🔑
```http
PUT /dattiec/update/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenChuRe": "string (optional)",
  "tenCoDau": "string (optional)",
  ...
}
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Hủy đặt tiệc 🔑
```http
PUT /dattiec/cancel/:id
Authorization: Bearer <accessToken>
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Lấy dịch vụ của đặt tiệc 🔑
```http
GET /dattiec/:id/dichvu
Authorization: Bearer <accessToken>
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Thêm dịch vụ vào đặt tiệc 🔑
```http
POST /dattiec/:id/dichvu
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "maDichVu": "number",
  "soLuong": "number",
  "donGiaThoiDiemDat": "number"
}
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Cập nhật dịch vụ 🔑
```http
PUT /dattiec/:id/dichvu/:maDichVu
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "soLuong": "number",
  "donGiaThoiDiemDat": "number"
}
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Xóa dịch vụ 🔑
```http
DELETE /dattiec/:id/dichvu/:maDichVu
Authorization: Bearer <accessToken>
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Lấy đặt tiệc theo ngày 🔑
```http
GET /dattiec/date/:ngay
Authorization: Bearer <accessToken>
Example: GET /dattiec/date/2024-12-25
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

### Lấy đặt tiệc theo tháng 🔑
```http
GET /dattiec/month/:thang/:nam
Authorization: Bearer <accessToken>
Example: GET /dattiec/month/12/2024
```
**Access:** Admin, Lễ tân, Bếp trưởng, Kế toán

---

## 2. HÓA ĐƠN (HOADON)

### Lấy tất cả hóa đơn
```http
GET /hoadon/lists
```

### Lấy chi tiết hóa đơn
```http
GET /hoadon/details/:id
```

### Lấy hóa đơn theo mã đặt tiệc
```http
GET /hoadon/dattiec/:maDatTiec
```

### Tạo hóa đơn mới
```http
POST /hoadon/create
Content-Type: application/json

{
  "maDatTiec": "number",
  "ngayThanhToan": "date",
  "apDungQuyDinhPhat": "boolean (optional, default: false)"
}

Response sẽ tự động tính:
- TongTienBan
- TongTienDichVu
- TongTienHoaDon
- TongTienPhat (nếu có)
- TongTienConLai
```

### Cập nhật hóa đơn
```http
PUT /hoadon/update/:id
Content-Type: application/json

{
  "ngayThanhToan": "date (optional)",
  "tongTienBan": "number (optional)",
  ...
}
```

### Cập nhật trạng thái thanh toán
```http
PUT /hoadon/:id/trangthai
Content-Type: application/json

{
  "trangThai": "number"
}

Trạng thái:
- 0: Chưa thanh toán
- 1: Đã thanh toán
```

### Xóa hóa đơn
```http
DELETE /hoadon/delete/:id
```

### Lấy hóa đơn theo tháng
```http
GET /hoadon/month/:thang/:nam
Example: GET /hoadon/month/12/2024
```

### Lấy hóa đơn theo trạng thái
```http
GET /hoadon/trangthai/:trangThai
Example: GET /hoadon/trangthai/0
```

---

## 3. BÁO CÁO DOANH SỐ (BAOCAODOANHSO)

### Lấy tất cả báo cáo
```http
GET /baocaodoanhso/lists
```

### Lấy chi tiết báo cáo
```http
GET /baocaodoanhso/details/:id
```MÓN ĂN (MONAN) 🍽️

**Required Permission:** MaChucNang = 3 (Quản lý món ăn)

**Allowed Roles:** ✅ Admin | ✅ Quản lý | ✅ Bếp trưởng

---

### Lấy tất cả món ăn 🔓
```http
GET /monan/lists
```
**Access:** Public

---

### Lấy chi tiết món ăn 🔓
```http
GET /monan/details/:id
```
**Access:** Public

---

### Tạo món ăn mới 🔑
```http
POST /monan/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenMonAn": "string",
  "donGiaHienTai": "number",
  "maLoai": "number"
}
```
**Access:** ✅ Admin, Quản lý, Bếp trưởng

---

### Cập nhật món ăn 🔑
```http
PUT /monan/update/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenMonAn": "string (optional)",
  "donGiaHienTai": "number (optional)",
  "maLoai": "number (optional)"
}
```
**Access:** ✅ Admin, Quản lý, Bếp trưởng

---

### Xóa món ăn 🔑
```http
DELETE /monan/delete/:id
Authorization: Bearer <accessToken>
```
**Access:** ✅ Admin, Quản lý, Bếp trưởng

---

## 5. SẢNH (SANH) 🏛️

**Required Permission:** MaChucNang = 2 (Quản lý sảnh)

**Allowed Roles:** ✅ Admin | ✅ Lễ tân | ✅ Quản lý

---

### Lấy tất cả sảnh 🔓
```http
GET /sanh/lists
```
**Access:** Public

---

### Lấy chi tiết sảnh 🔓
```http
GET /sanh/details/:id
```
**Access:** Public

---

### Tạo sảnh mới 🔑
```http
POST /sanh/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenSanh": "string",
  "soLuongBan": "number",
  "donGiaHienTai": "number",
  "maLoai": "number"
}
```
**Access:** ✅ Admin, Lễ tân, Quản lý

---

### Cập nhật sảnh 🔑
```http
PUT /sanh/update/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** ✅ Admin, Lễ tân, Quản lý

---

### Xóa sảnh 🔑
```http
DELETE /sanh/delete/:id
Authorization: Bearer <accessToken>
```
**Access:** ✅ Admin, Lễ tân, Quản lý

---

## 6. DỊCH VỤ (DICHVU) 🎊

**Required Permission:** MaChucNang = 4 (Quản lý dịch vụ)

**Allowed Roles:** ✅ Admin | ✅ Quản lý

---

### Lấy tất cả dịch vụ 🔓
```http
GET /dichvu/lists
```
**Access:** Public

---

### Lấy chi tiết dịch vụ 🔓
```http
GET /dichvu/details/:id
```
**Access:** Public

---

### Tạo dịch vụ mới 🔑
```http
POST /dichvu/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenDichVu": "string",
  "donGiaHienTai": "number",
  "maLoai": "number"
}
```
**Access:** ✅ Admin, Quản lý

---

### Cập nhật dịch vụ 🔑
```http
PUT /dichvu/update/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** ✅ Admin, Quản lý

---

### Xóa dịch vụ 🔑
```http
DELETE /dichvu/delete/:id
Authorization: Bearer <accessToken>
```
**Access:** ✅ Admin, Quản lý

---

## 7. 

### Lấy báo cáo theo tháng/năm
```http
GET /baocaodoanhso/thang/:thang/nam/:nam
Example: GET /baocaodoanhso/thang/12/nam/2024
```

### Tạo báo cáo doanh số
```http
POST /baocaodoanhso/create
Content-Type: application/json

{
  "thang": "number (1-12)",
  "nam": "number"
}

Response sẽ tự động tính:
- TongDoanhThu
- ChiTiet theo ngày (SoLuongTiec, DoanhThu, TiLe)
```

### Cập nhật báo cáo
```http
PUT /baocaodoanhso/update/:id
Content-Type: application/json

{
  "thang": "number (optional)",
  "nam": "number (optional)",
  "tongDoanhThu": "number (optional)"
}
```

### Xóa báo cáo
```http
DELETE /baocaodoanhso/delete/:id
```

### Lấy báo cáo theo năm
```http
GET /baocaodoanhso/nam/:nam
Example: GET /baocaodoanhso/nam/2024
```

---

## 4. THỰC ĐƠN (THUCDON)

### Lấy tất cả thực đơn
```http
GET /thucdon/lists
```

### Lấy chi tiết thực đơn
```http
GET /thucdon/details/:id
Response bao gồm danh sách món ăn
```

### Tạo thực đơn mới
```http
POST /thucdon/create
Content-Type: application/json

{
  "tenThucDon": "string",
  "ghiChu": "string (optional)"
}
```

### Tạo thực đơn từ thực đơn mẫu
```http
POST /thucdon/create-from-template
Content-Type: application/json

{
  "maThucDonMau": "number",
  "tenThucDon": "string (optional)",
  "ghiChu": "string (optional)"
}
```

### Cập nhật thực đơn
```http
PUT /thucdon/update/:id
Content-Type: application/json

{
  "tenThucDon": "string (optional)",
  "ghiChu": "string (optional)"
}
```

### Xóa thực đơn
```http
DELETE /thucdon/delete/:id
```

### Lấy món ăn trong thực đơn
```http
GET /thucdon/:id/monan
```

### Thêm món ăn vào thực đơn
```http
POST /thucdon/:id/monan
Content-Type: application/json

{
  "maMonAn": "number",
  "donGiaThoiDiemDat": "number"
}

Note: TongDonGiaThoiDiemDat sẽ tự động cập nhật
```

### Cập nhật món ăn trong thực đơn
```http
PUT /thucdon/:id/monan/:maMonAn
Content-Type: application/json

{
  "donGiaThoiDiemDat": "number"
}
```

### Xóa món ăn khỏi thực đơn
```http
DELETE /thucdon/:id/monan/:maMonAn
```

---

## 5. THỰC ĐƠN MẪU (THUCDONMAU)

### Lấy tất cả thực đơn mẫu
```http
GET /thucdonmau/lists
```

### Lấy chi tiết thực đơn mẫu
```http
GET /thucdonmau/details/:id
```

### Tạo thực đơn mẫu
```http
POST /thucdonmau/create
Content-Type: application/json

{
  "tenThucDon": "string",
  "donGiaHienTai": "number",
  "ghiChu": "string (optional)"
}
```

### Cập nhật thực đơn mẫu
```http
PUT /thucdonmau/update/:id
Content-Type: application/json

{
  "tenThucDon": "string (optional)",
  "donGiaHienTai": "number (optional)",
  "ghiChu": "string (optional)"
}
```

### Xóa thực đơn mẫu
```http
DELETE /thucdonmau/delete/:id
```

### Lấy món ăn trong thực đơn mẫu
```http
GET /thucdonmau/:id/monan
```

### Thêm món ăn vào thực đơn mẫu
```8. CHỨC NĂNG (CHUCNANG) 🔧

**Required Permission:** MaChucNang = 1 (Quản lý người dùng)

**Allowed Roles:** ✅ Admin only

---

### Lấy tất cả chức năng 🔑
```http
GET /chucnang/lists
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

### Lấy chi tiết chức năng 🔑
```http
GET /chucnang/details/:id
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

### Tạo chức năng 🔑
```http
POST /chucnang/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenChucNang": "string",
  "tenManHinh": "string"
}
```
**Access:** ✅ **Admin only**

---

### Cập nhật chức năng 🔑
```http
PUT /chucnang/update/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "tenChucNang": "string (optional)",
  "tenManHinh": "string (optional)"
}
```
**Access:** ✅ **Admin only**

---

### Xóa chức năng 🔑
```http
DELETE /chucnang/delete/:id
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

## 9. PHÂN QUYỀN (PHANQUYEN) 🔐

**Required Permission:** MaChucNang = 1 (Quản lý người dùng)

**Allowed Roles:** ✅ Admin only

> ⚠️ **Warning:** Tất cả endpoints phân quyền chỉ dành cho Admin

---

### Lấy tất cả phân quyền 🔑
```http
GET /phanquyen/lists
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

### Lấy phân quyền theo nhóm 🔑
```http
GET /phanquyen/nhom/:maNhom
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

### Lấy phân quyền theo chức năng 🔑
```http
GET /phanquyen/chucnang/:maChucNang
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

### Kiểm tra quyền 🔑
```http
GET /phanquyen/check/:maNhom/:maChucNang
Authorization: Bearer <accessToken>

Response: { "hasPermission": true/false }
```
**Access:** ✅ **Admin only**

---

### Thêm phân quyền 🔑
```http
POST /phanquyen/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "maNhom": "number",
  "maChucNang": "number"
}
```
**Access:** ✅ **Admin only**

---

### Xóa phân quyền 🔑
```http
DELETE /phanquyen/delete/:maNhom/:maChucNang
Authorization: Bearer <accessToken>
```
**Access:** ✅ **Admin only**

---

### Cập nhật phân quyền cho nhóm 🔑
```http
PUT /phanquyen/nhom/:maNhom
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "danhSachChucNang": [1, 2, 3, 4]
}

Note: Sẽ xóa hết phân quyền cũ và thêm mới theo danh sách
```
**Access:** ✅ **Admin only**
### Lấy tất cả phân quyền
```http
GET /phanquyen/lists
```

### Lấy phân quyền theo nhóm
```http
GET /phanquyen/nhom/:maNhom
```

### Lấy phân quyền theo chức năng
```http
GET /phanquyen/chucnang/:maChucNang
```

### Kiểm tra quyền
```http
GET /phanquyen/check/:maNhom/:maChucNang
Response: { "hasPermission": true/false }
```

### Thêm phân quyền
```http
POST /phanquyen/create
Content-Type: application/json

{
  "maNhom": "number",
  "maChucNang": "number"
}
```

### Xóa phân quyền
```http
DELETE /phanquyen/delete/:maNhom/:maChucNang
```

### Cập nhật phân quyền cho nhóm
```http
PUT /phanquyen/nhom/:maNhom
Content-Type: application/json

{
  "danhSachChucNang": [1, 2, 3, 4]
}

Note: Sẽ xóa hết phân quyền cũ và thêm mới theo danh sách
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400/404/500
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (Validation Error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

1. **Authentication:** Tất cả endpoints có icon 🔒 hoặc 🔑 cần authentication token trong header
2. **Authorization:** Endpoints có icon 🔑 yêu cầu kiểm tra quyền theo nhóm người dùng
3. **Dates:** Phải theo format ISO: `YYYY-MM-DD`
4. **Numbers:** Số tiền (numeric) phải >= 0
5. **Soft delete:** Bản ghi không bị xóa thật, chỉ đánh dấu `DaXoa = true`
6. **Foreign key:** Constraints được validate trước khi insert/update

---

## Authorization Header Format

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Quick Reference - Permissions by Role

### Admin (MaNhom = 1)
- ✅ Toàn quyền tất cả endpoints
- ✅ Quản lý người dùng
- ✅ Quản lý chức năng & phân quyền

### Lễ tân (MaNhom = 2)
- ✅ Quản lý sảnh (GET, POST, PUT, 

### Guest (MaNhom = 6)
- ✅ Truy cập public endpoints (lists, details)
- ❌ Không thể tạo/sửa/xóa bất kỳ dữ liệu nào
- 📧 Cần liên hệ Admin để nâng cấp quyền

---

## 🔄 Workflow Nâng Cấp Quyền

### Admin cấp quyền cho Guest:
```sql
-- Cập nhật role cho user
UPDATE "NGUOIDUNG" 
SET "MaNhom" = 2  -- Lễ tân
WHERE "MaNguoiDung" = 10;
```

Hoặc qua API:
```http
PUT /api/nguoidung/update/10
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "maNhom": 2
}
```

**Lưu ý:** User cần login lại để token mới có quyền được cập nhật.DELETE)
- ✅ Quản lý đặt tiệc (Full CRUD)
- ❌ Không thể quản lý món ăn, dịch vụ

### Quản lý (MaNhom = 3)
- ✅ Quản lý sảnh (Full CRUD)
- ✅ Quản lý món ăn (Full CRUD)
- ✅ Quản lý dịch vụ (Full CRUD)
- ❌ Không thể quản lý đặt tiệc

### Bếp trưởng (MaNhom = 4)
- ✅ Quản lý món ăn (Full CRUD)
- ✅ Xem đặt tiệc (để biết chuẩn bị)
- ❌ Không thể quản lý sảnh, dịch vụ

### Kế toán (MaNhom = 5)
- ✅ Xem đặt tiệc
- ✅ Quản lý hóa đơn
- ❌ Không thể CRUD các module khác

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Khong co thong tin nguoi dung",
  "statusCode": 401
}
```
**Cause:** Token không hợp lệ hoặc đã hết hạn

---

### 403 Forbidden
```json
{
  "success": false,
  "message": "Ban khong co quyen truy cap chuc nang nay",
  "statusCode": 403
}
```
**Cause:** User không có quyền truy cập endpoint này

---

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "statusCode": 400
}
```
**Cause:** Dữ liệu đầu vào không hợp lệ
