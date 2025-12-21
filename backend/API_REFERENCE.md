# API Documentation - Quick Reference

## Base URL
```
http://localhost:3000/api
```

---

## 1. ĐẶT TIỆC (DATTIEC)

### Lấy tất cả đặt tiệc
```http
GET /dattiec/lists
```

### Lấy chi tiết đặt tiệc
```http
GET /dattiec/details/:id
```

### Tạo đặt tiệc mới
```http
POST /dattiec/create
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

### Cập nhật đặt tiệc
```http
PUT /dattiec/update/:id
Content-Type: application/json

{
  "tenChuRe": "string (optional)",
  "tenCoDau": "string (optional)",
  ...
}
```

### Hủy đặt tiệc
```http
PUT /dattiec/cancel/:id
```

### Lấy dịch vụ của đặt tiệc
```http
GET /dattiec/:id/dichvu
```

### Thêm dịch vụ vào đặt tiệc
```http
POST /dattiec/:id/dichvu
Content-Type: application/json

{
  "maDichVu": "number",
  "soLuong": "number",
  "donGiaThoiDiemDat": "number"
}
```

### Cập nhật dịch vụ
```http
PUT /dattiec/:id/dichvu/:maDichVu
Content-Type: application/json

{
  "soLuong": "number",
  "donGiaThoiDiemDat": "number"
}
```

### Xóa dịch vụ
```http
DELETE /dattiec/:id/dichvu/:maDichVu
```

### Lấy đặt tiệc theo ngày
```http
GET /dattiec/date/:ngay
Example: GET /dattiec/date/2024-12-25
```

### Lấy đặt tiệc theo tháng
```http
GET /dattiec/month/:thang/:nam
Example: GET /dattiec/month/12/2024
```

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
```

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
```http
POST /thucdonmau/:id/monan
Content-Type: application/json

{
  "maMonAn": "number"
}
```

### Xóa món ăn khỏi thực đơn mẫu
```http
DELETE /thucdonmau/:id/monan/:maMonAn
```

### Sao chép thực đơn mẫu
```http
POST /thucdonmau/:id/copy
Content-Type: application/json

{
  "tenThucDon": "string (optional)",
  "ghiChu": "string (optional)"
}

Response: Thực đơn mới được tạo từ template
```

---

## 6. THAM SỐ HỆ THỐNG (THAMSO)

### Lấy tham số
```http
GET /thamso
```

### Cập nhật tham số
```http
PUT /thamso/update
Content-Type: application/json

{
  "phanTramPhatTrenNgay": "number (0-100)"
}
```

---

## 7. CHỨC NĂNG (CHUCNANG)

### Lấy tất cả chức năng
```http
GET /chucnang/lists
```

### Lấy chi tiết chức năng
```http
GET /chucnang/details/:id
```

### Tạo chức năng
```http
POST /chucnang/create
Content-Type: application/json

{
  "tenChucNang": "string",
  "tenManHinh": "string"
}
```

### Cập nhật chức năng
```http
PUT /chucnang/update/:id
Content-Type: application/json

{
  "tenChucNang": "string (optional)",
  "tenManHinh": "string (optional)"
}
```

### Xóa chức năng
```http
DELETE /chucnang/delete/:id
```

---

## 8. PHÂN QUYỀN (PHANQUYEN)

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

1. Tất cả endpoints (trừ login/register) cần authentication token
2. Dates phải theo format ISO: `YYYY-MM-DD`
3. Số tiền (numeric) phải >= 0
4. Soft delete: Bản ghi không bị xóa thật, chỉ đánh dấu `DaXoa = true`
5. Foreign key constraints được validate trước khi insert/update
