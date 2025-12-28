# Kịch Bản Demo - Hệ Thống Quản Lý Tiệc Cưới Everlasting

## 📋 Mục Lục
1. [Chuẩn Bị Demo](#chuẩn-bị-demo)
2. [Kịch Bản 1: Quyền Admin - Quản Lý Toàn Diện](#kịch-bản-1-quyền-admin)
3. [Kịch Bản 2: Quyền Kế Toán - Quản Lý Hóa Đơn](#kịch-bản-2-quyền-kế-toán)
4. [Các Tình Huống Lỗi & Xử Lý](#các-tình-huống-lỗi)
5. [Checklist Demo](#checklist-demo)

---

## 🎬 CHUẨN BỊ DEMO

### Dữ Liệu Mẫu Cần Có
- ✅ Ít nhất 2 user: Admin và Kế toán
- ✅ 3-4 loại món ăn (Hải sản, Thịt, Rau củ, Tráng miệng)
- ✅ 5-10 món ăn đa dạng
- ✅ 2-3 thực đơn mẫu
- ✅ 2-3 sảnh (Standard, VIP, Premium)
- ✅ 3 ca (Sáng, Trưa, Tối)
- ✅ 3-5 dịch vụ (Trang trí, MC, Ban nhạc...)
- ✅ Tham số hệ thống (Đơn giá bàn tối thiểu, % phạt/ngày)

### Setup Trước Demo
```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend
cd frontend
npm run dev

# 3. Kiểm tra database connection
# 4. Clear cache trình duyệt
# 5. Mở 2 tab: Admin và Kế toán
```

---

## 🎯 KỊCH BẢN 1: QUYỀN ADMIN - QUẢN LÝ TOÀN DIỆN

### PHẦN 1: ĐĂNG NHẬP & TỔNG QUAN (5 phút)

#### Bước 1.1: Đăng Nhập Admin
**Actions:**
```
1. Mở http://localhost:5173/login
2. Username: admin
3. Password: admin123
4. Click "Đăng nhập"
```

**Expected Result:**
- ✅ **Thành công:** Chuyển hướng đến `/home`
- ✅ Hiển thị thông báo: "Đăng nhập thành công"
- ✅ Header hiển thị: "Xin chào, Administrator"
- ✅ Menu đầy đủ: Quản lý Người dùng, Món ăn, Đặt tiệc, Hóa đơn, Thống kê

**Error Cases:**
- ❌ Sai username/password: "Tên đăng nhập hoặc mật khẩu không đúng"
- ❌ Để trống: "Vui lòng nhập đầy đủ thông tin"
- ❌ Backend offline: "Không thể kết nối đến server"

**Related Files:**
- Frontend: `src/pages/login.jsx` (handleLogin)
- API: `src/services/api.js` (login)
- Backend: `src/controller/nguoidung.controller.js` (login)
- Route: `src/routes/nguoidung.routes.js`

---

#### Bước 1.2: Xem Dashboard Tổng Quan
**Actions:**
```
1. Click menu "Trang chủ"
2. Quan sát các số liệu thống kê
```

**Expected Result:**
- ✅ Hiển thị tổng số: Món ăn, Đặt tiệc, Hóa đơn chờ, Doanh thu tháng
- ✅ Biểu đồ doanh thu 7 ngày gần nhất
- ✅ Danh sách đặt tiệc sắp diễn ra

**Related Files:**
- Frontend: `src/pages/Home.jsx`
- API: `src/services/api.js` (getStats)

---

### PHẦN 2: QUẢN LÝ MÓN ĂN & THỰC ĐƠN (10 phút)

#### Bước 2.1: Thêm Món Ăn Mới
**Actions:**
```
1. Click menu "Quản lý" → "Quản lý món ăn"
2. Click button "Thêm món ăn mới"
3. Điền form:
   - Tên món: "Tôm Hùm Alaska"
   - Loại món: "Hải sản"
   - Đơn giá: 350000
   - Ghi chú: "Tôm hùm tươi sống, nướng bơ tỏi"
   - Upload ảnh (optional)
4. Click "Lưu"
```

**Expected Result:**
- ✅ **Thành công:** Modal đóng, reload table
- ✅ Thông báo: "Tạo món ăn thành công"
- ✅ Món ăn mới xuất hiện trong danh sách
- ✅ Có icon "Sửa" và "Xóa"

**Error Cases:**
- ❌ Tên món đã tồn tại: "Tên món ăn đã tồn tại"
- ❌ Đơn giá < 0: "Đơn giá phải lớn hơn hoặc bằng 0"
- ❌ Tên món quá ngắn (< 2 ký tự): "Tên món ăn phải có ít nhất 2 ký tự"
- ❌ Loại món không tồn tại: "Loại món ăn không tồn tại"

**Related Files:**
- Frontend: `src/pages/MenuManagement.jsx` (handleSaveMonAn)
- API: `src/services/api.js` (createMonAn)
- Backend: `src/controller/monan.controller.js` (createDish)
- Service: `src/services/monan.services.js` (validateDishCreation)
- Model: `src/models/monan.model.js` (create)

**Request/Response:**
```javascript
// REQUEST
POST /api/monan/create
{
  "tenMonAn": "Tôm Hùm Alaska",
  "maLoaiMonAn": 1,
  "donGia": 350000,
  "ghiChu": "Tôm hùm tươi sống, nướng bơ tỏi"
}

// RESPONSE (Success)
{
  "success": true,
  "message": "Tạo món ăn thành công",
  "data": {
    "MaMonAn": 25,
    "TenMonAn": "Tôm Hùm Alaska",
    "DonGia": 350000,
    ...
  }
}
```

---

#### Bước 2.2: Tạo Thực Đơn Mẫu Mới
**Actions:**
```
1. Scroll xuống phần "Quản lý thực đơn mẫu"
2. Click "Tạo thực đơn mẫu mới"
3. Điền:
   - Tên: "Set Tiệc VIP Valentine"
   - Mô tả: "Thực đơn đặc biệt cho ngày Valentine"
4. Click "Lưu"
```

**Expected Result:**
- ✅ Thông báo: "Tạo thực đơn mẫu thành công"
- ✅ Dropdown "Chọn thực đơn mẫu" cập nhật
- ✅ Hiển thị thực đơn trống (0 món)

**Related Files:**
- Frontend: `src/pages/MenuManagement.jsx`
- Backend: `src/controller/thucdonmau.controller.js`
- Model: `src/models/thucdonmau.model.js`

---

#### Bước 2.3: Thêm Món Vào Thực Đơn Mẫu
**Actions:**
```
1. Chọn thực đơn "Set Tiệc VIP Valentine"
2. Tìm món "Tôm Hùm Alaska" trong table món ăn
3. Click icon "+" bên cạnh món
4. Lặp lại với 4-5 món khác
```

**Expected Result:**
- ✅ Mỗi lần thêm: Thông báo "Thêm món ăn vào thực đơn mẫu thành công"
- ✅ Số lượng món trong thực đơn tăng lên
- ✅ Table "Món ăn trong thực đơn mẫu" cập nhật
- ✅ Icon "+" đổi thành "-" (đã có trong thực đơn)

**Error Cases:**
- ❌ Món đã có trong thực đơn: "Món ăn đã tồn tại trong thực đơn mẫu"

**Related Files:**
- Frontend: `src/pages/MenuManagement.jsx` (handleAddMonAnToThucDonMau)
- Backend: `src/routes/thucdonmau.routes.js` (POST /:id/monan)
- Model: `src/models/thucdonmau.model.js` (addMonAn)

---

### PHẦN 3: QUẢN LÝ SẢNH & CA (5 phút)

#### Bước 3.1: Xem Danh Sách Sảnh
**Actions:**
```
1. Click menu "Quản lý" → "Quản lý sảnh"
2. Xem thông tin các sảnh
```

**Expected Result:**
- ✅ Hiển thị table: Tên sảnh, Loại sảnh, Số bàn tối đa, Đơn giá tối thiểu
- ✅ Có filter theo loại sảnh
- ✅ Có button "Thêm", "Sửa", "Xóa"

---

#### Bước 3.2: Thử Xóa Sảnh Đang Sử Dụng
**Actions:**
```
1. Chọn 1 sảnh đã có đặt tiệc
2. Click "Xóa"
3. Confirm xóa
```

**Expected Result:**
- ❌ **Lỗi:** "Sảnh đang được sử dụng trong đặt tiệc, không thể xóa"
- ✅ Sảnh vẫn tồn tại (không bị xóa)

**Note:** Đây là demo về validation business logic - không thể xóa resource đang được sử dụng.

---

### PHẦN 4: ĐẶT TIỆC (15 phút)

#### Bước 4.1: Tạo Đặt Tiệc Mới
**Actions:**
```
1. Click menu "Quản lý" → "Quản lý đặt tiệc"
2. Click "Tạo đặt tiệc mới"
3. Điền form:
   - Tên chú rể: "Nguyễn Văn A"
   - Tên cô dâu: "Trần Thị B"
   - Điện thoại: "0901234567"
   - Ngày đại tiệc: "14/02/2025" (Valentine)
   - Ca: "Tối"
   - Sảnh: "VIP Hall"
   - Thực đơn: "Set Tiệc VIP Valentine" (vừa tạo)
   - Số lượng bàn: 40
   - Số bàn dự trữ: 2
   - Tổng tiền dự kiến: 200000000
   - Tiền đặt cọc: 50000000 (25%)
4. Click "Tạo đặt tiệc"
```

**Expected Result:**
- ✅ Thông báo: "Đặt tiệc thành công"
- ✅ Reload danh sách đặt tiệc
- ✅ Hiển thị đặt tiệc mới với status "Chưa thanh toán"
- ✅ Có button "Chi tiết", "Thêm dịch vụ", "Tạo hóa đơn"

**Validation Messages:**
- ✅ Tiền đặt cọc >= 15%: Pass
- ✅ Số bàn <= Số bàn tối đa sảnh: Pass
- ✅ Không trùng lịch (ngày + ca + sảnh): Pass

**Error Cases:**
- ❌ Tiền cọc < 15%: "Tiền đặt cọc phải >= 15% tổng tiền dự kiến"
- ❌ Số bàn vượt quá: "Số lượng bàn vượt quá số bàn tối đa của sảnh"
- ❌ Trùng lịch: "Sảnh đã được đặt vào thời gian này"
- ❌ Giá bàn < đơn giá tối thiểu: "Giá bàn phải >= đơn giá tối thiểu"

**Related Files:**
- Frontend: `src/pages/ManagerBooking.jsx` (handleCreateBooking)
- Backend: `src/controller/dattiec.controller.js` (createDatTiec)
- Service: `src/services/dattiec.services.js` (validateDatTiecCreation)
- Middleware: `src/middleware/validations/validateDatTiec.js` (validateMinTablePrice)

**Request/Response:**
```javascript
// REQUEST
POST /api/dattiec/create
{
  "tenChuRe": "Nguyễn Văn A",
  "tenCoDau": "Trần Thị B",
  "ngayDaiTiec": "2025-02-14",
  "maCa": 3,
  "maSanh": 2,
  "maThucDon": 5,
  "soLuongBan": 40,
  "soBanDuTru": 2,
  "tienDatCoc": 50000000
}

// RESPONSE
{
  "success": true,
  "message": "Tao dat tiec thanh cong",
  "data": {
    "MaDatTiec": 15,
    ...
  }
}
```

---

#### Bước 4.2: Thêm Dịch Vụ Cho Đặt Tiệc
**Actions:**
```
1. Click "Chi tiết" đặt tiệc vừa tạo
2. Tab "Dịch vụ" → Click "Thêm dịch vụ"
3. Chọn:
   - Dịch vụ: "Trang trí sân khấu VIP"
   - Số lượng: 1
   - Đơn giá: 5000000
4. Click "Thêm"
5. Lặp lại với:
   - "MC chuyên nghiệp" - 3000000
   - "Ban nhạc acoustic" - 8000000
```

**Expected Result:**
- ✅ Mỗi lần thêm: Thông báo "Thêm dịch vụ thành công"
- ✅ Table dịch vụ cập nhật
- ✅ Tổng tiền dịch vụ tự động tính: 16,000,000 đ

**Related Files:**
- Frontend: `src/pages/ManagerBooking.jsx`
- Backend: `src/controller/dattiec.controller.js` (addDichVu)

---

#### Bước 4.3: Demo Validation - Trùng Lịch
**Actions:**
```
1. Click "Tạo đặt tiệc mới" lần nữa
2. Điền form với:
   - Ngày đại tiệc: "14/02/2025" (trùng)
   - Ca: "Tối" (trùng)
   - Sảnh: "VIP Hall" (trùng)
3. Click "Tạo đặt tiệc"
```

**Expected Result:**
- ❌ **Lỗi:** "Sảnh đã được đặt vào thời gian này"
- ✅ Form không submit
- ✅ Hiển thị message dưới dropdown sảnh

**Note:** Đây là demo về conflict detection trong hệ thống booking.

---

### PHẦN 5: QUẢN LÝ HÓA ĐƠN (15 phút)

#### Bước 5.1: Tạo Hóa Đơn Không Phạt
**Actions:**
```
1. Click menu "Quản lý" → "Quản lý hóa đơn"
2. Tìm đặt tiệc "Nguyễn Văn A - Trần Thị B"
3. Click "Tạo hóa đơn"
4. Điền:
   - Ngày thanh toán: "14/02/2025" (đúng ngày đại tiệc)
   - Áp dụng quy định phạt: ☐ KHÔNG tick
5. Click "Tạo hóa đơn"
```

**Expected Result:**
- ✅ Thông báo: "Tạo hóa đơn thành công"
- ✅ Hiển thị preview hóa đơn:
  ```
  Tổng tiền bàn: 189,000,000 đ
  Tổng tiền dịch vụ: 16,000,000 đ
  Tổng tiền hóa đơn: 205,000,000 đ
  Tiền đặt cọc: -50,000,000 đ
  Tiền phạt: 0 đ
  ─────────────────────────────
  Tổng tiền còn lại: 155,000,000 đ
  ```
- ✅ Status: "Chưa thanh toán"

**Related Files:**
- Frontend: `src/pages/InvoiceManagement.jsx` (handleCreateInvoice)
- Backend: `src/controller/hoadon.controller.js` (createHoaDon)
- Service: `src/services/hoadon.services.js` (calculateHoaDon)

**Request/Response:**
```javascript
// REQUEST
POST /api/hoadon/create
{
  "maDatTiec": 15,
  "ngayThanhToan": "2025-02-14",
  "apDungQuyDinhPhat": false
}

// RESPONSE
{
  "success": true,
  "data": {
    "MaHoaDon": 8,
    "TongTienBan": 189000000,
    "TongTienDichVu": 16000000,
    "TongTienHoaDon": 205000000,
    "TongTienPhat": 0,
    "TongTienConLai": 155000000,
    "TrangThai": 0
  }
}
```

---

#### Bước 5.2: Demo Tính Phạt Trễ 3 Ngày
**Actions:**
```
1. Click "Xóa" hóa đơn vừa tạo (để demo lại)
2. Confirm xóa
3. Click "Tạo hóa đơn" lại
4. Điền:
   - Ngày thanh toán: "17/02/2025" (trễ 3 ngày)
   - Áp dụng quy định phạt: ☑ TICK
5. Click "Tạo hóa đơn"
```

**Expected Result:**
- ✅ Thông báo: "Tạo hóa đơn thành công"
- ✅ Hiển thị preview hóa đơn:
  ```
  Tổng tiền bàn: 189,000,000 đ
  Tổng tiền dịch vụ: 16,000,000 đ
  Tổng tiền hóa đơn: 205,000,000 đ
  
  ⚠️ Thanh toán trễ 3 ngày
  Phạt (1% x 3 ngày): +6,150,000 đ
  
  Tiền đặt cọc: -50,000,000 đ
  ─────────────────────────────
  Tổng tiền còn lại: 161,150,000 đ
  ```

**Calculation Logic:**
```javascript
// Số ngày trễ
soNgayTre = ceil((17/2 - 14/2) / 1 day) = 3 ngày

// Tiền phạt
tongTienPhat = tongTienHoaDon * (phanTramPhat / 100) * soNgayTre
             = 205,000,000 * (1 / 100) * 3
             = 6,150,000 đ

// Tổng còn lại
tongTienConLai = 205,000,000 + 6,150,000 - 50,000,000
               = 161,150,000 đ
```

**Related Code:**
```javascript
// backend/src/services/hoadon.services.js
export const calculateHoaDon = async (maDatTiec, ngayThanhToan, apDungQuyDinhPhat) => {
  const datTiec = await DatTiec.findById(maDatTiec);
  const thucDon = await ThucDon.findById(datTiec.MaThucDon);
  
  // 1. Tính tiền bàn
  const tongTienBan = thucDon.TongDonGiaThoiDiemDat * 
                     (datTiec.SoLuongBan + datTiec.SoBanDuTru);
  
  // 2. Tính tiền dịch vụ
  const dichVuList = await DatTiec.getDichVu(maDatTiec);
  const tongTienDichVu = dichVuList.reduce((sum, dv) => sum + parseFloat(dv.ThanhTien), 0);
  
  // 3. Tổng hóa đơn
  let tongTienHoaDon = tongTienBan + tongTienDichVu;
  
  // 4. Tính phạt
  let tongTienPhat = 0;
  if (apDungQuyDinhPhat) {
    const ngayDaiTiec = new Date(datTiec.NgayDaiTiec);
    const ngayTT = new Date(ngayThanhToan);
    
    if (ngayTT > ngayDaiTiec) {
      const thamSo = await ThamSo.get();
      const soNgayTre = Math.ceil((ngayTT - ngayDaiTiec) / (1000*60*60*24));
      tongTienPhat = tongTienHoaDon * (thamSo.PhanTramPhatTrenNgay / 100) * soNgayTre;
    }
  }
  
  // 5. Tổng còn lại
  const tongTienConLai = tongTienHoaDon + tongTienPhat - datTiec.TienDatCoc;
  
  return { tongTienBan, tongTienDichVu, tongTienHoaDon, tongTienPhat, tongTienConLai };
};
```

---

#### Bước 5.3: Thanh Toán Hóa Đơn
**Actions:**
```
1. Click "Chi tiết" hóa đơn vừa tạo
2. Click button "Thanh toán"
3. Confirm thanh toán
```

**Expected Result:**
- ✅ Thông báo: "Thanh toán hóa đơn thành công"
- ✅ Status đổi từ "Chưa thanh toán" → "Đã thanh toán"
- ✅ Button "Thanh toán" biến mất
- ✅ Badge status màu xanh

**Related Files:**
- Frontend: `src/pages/InvoiceManagement.jsx` (handlePayInvoice)
- Backend: `src/controller/hoadon.controller.js` (updateStatus)

---

### PHẦN 6: THỐNG KÊ & BÁO CÁO (10 phút)

#### Bước 6.1: Xem Thống Kê Tháng Hiện Tại
**Actions:**
```
1. Click menu "Thống kê"
2. Chọn tháng: "Tháng 2"
3. Chọn năm: "2025"
4. Click "Xem báo cáo"
```

**Expected Result (nếu báo cáo chưa có):**
- ⚠️ Thông báo: "Báo cáo chưa tồn tại"
- ✅ Hiển thị button "Tạo báo cáo"

**Actions tiếp:**
```
5. Click "Tạo báo cáo"
```

**Expected Result:**
- ✅ Thông báo: "Tạo báo cáo doanh số thành công"
- ✅ Hiển thị:
  - Tổng doanh thu tháng: 534,710,000 đ
  - Biểu đồ cột: Doanh thu từng ngày
  - Table chi tiết:
    ```
    Ngày       | Số lượng tiệc | Doanh thu        | Tỷ lệ
    ─────────────────────────────────────────────────────
    14/02/2025 | 2             | 352,910,000 đ   | 66.00%
    17/02/2025 | 1             | 181,800,000 đ   | 34.00%
    ```

**Related Files:**
- Frontend: `src/pages/Stats.jsx` (loadBaoCao, handleCreateBaoCao)
- Backend: `src/controller/baocaodoanhso.controller.js` (createBaoCao, getBaoCaoByThangNam)
- Service: `src/services/baocaodoanhso.services.js` (generateBaoCaoDoanhSo)

**Calculation Logic:**
```javascript
// backend/src/services/baocaodoanhso.services.js
export const generateBaoCaoDoanhSo = async (thang, nam) => {
  // 1. Lấy tất cả hóa đơn đã thanh toán trong tháng
  const hoaDonList = await db('HOADON')
    .whereRaw('EXTRACT(MONTH FROM "NgayThanhToan") = ?', [thang])
    .whereRaw('EXTRACT(YEAR FROM "NgayThanhToan") = ?', [nam])
    .where('TrangThai', 1);

  // 2. Tính tổng doanh thu
  const tongDoanhThu = hoaDonList.reduce((sum, hd) => {
    return sum + parseFloat(hd.TongTienHoaDon) + parseFloat(hd.TongTienPhat);
  }, 0);

  // 3. Tạo báo cáo chính
  const baoCao = await db('BAOCAODOANHSO').insert({
    Thang: thang,
    Nam: nam,
    TongDoanhThu: tongDoanhThu
  }).returning('*');

  // 4. Nhóm theo ngày
  const doanhThuTheoNgay = {};
  hoaDonList.forEach(hd => {
    const ngay = new Date(hd.NgayThanhToan).toISOString().split('T')[0];
    if (!doanhThuTheoNgay[ngay]) {
      doanhThuTheoNgay[ngay] = { soLuongTiec: 0, doanhThu: 0 };
    }
    doanhThuTheoNgay[ngay].soLuongTiec += 1;
    doanhThuTheoNgay[ngay].doanhThu += parseFloat(hd.TongTienHoaDon) + parseFloat(hd.TongTienPhat);
  });

  // 5. Tạo chi tiết báo cáo
  const chiTiet = Object.keys(doanhThuTheoNgay).map(ngay => {
    const { soLuongTiec, doanhThu } = doanhThuTheoNgay[ngay];
    const tiLe = (doanhThu / tongDoanhThu) * 100;
    return {
      MaBaoCaoDoanhSo: baoCao[0].MaBaoCaoDoanhSo,
      Ngay: ngay,
      SoLuongTiec: soLuongTiec,
      DoanhThu: doanhThu,
      TiLe: tiLe.toFixed(2)
    };
  });

  await db('CHITIET_BAOCAODOANHSO').insert(chiTiet);
  
  return { ...baoCao[0], chiTiet };
};
```

---

#### Bước 6.2: Filter & Export
**Actions:**
```
1. Click "Filter theo ngày"
2. Chọn: "Từ 14/02 đến 17/02"
3. Click "Áp dụng"
```

**Expected Result:**
- ✅ Table chi tiết lọc chỉ hiển thị 2 ngày
- ✅ Biểu đồ cập nhật
- ✅ Tổng doanh thu không đổi (vẫn tính toàn tháng)

**Actions tiếp:**
```
4. Click "Xuất Excel"
```

**Expected Result:**
- ✅ Download file: `BaoCaoDoanhSo_T2_2025.xlsx`
- ✅ File chứa đầy đủ dữ liệu đã filter

---

### PHẦN 7: QUẢN LÝ NGƯỜI DÙNG (5 phút)

#### Bước 7.1: Thêm Người Dùng Mới
**Actions:**
```
1. Click menu "Quản lý" → "Quản lý người dùng"
2. Click "Thêm người dùng"
3. Điền:
   - Tên đăng nhập: "ketoan01"
   - Mật khẩu: "123456"
   - Họ tên: "Nguyễn Văn Kế Toán"
   - Nhóm người dùng: "Kế toán"
4. Click "Lưu"
```

**Expected Result:**
- ✅ Thông báo: "Tạo người dùng thành công"
- ✅ User mới xuất hiện trong table
- ✅ Mật khẩu đã được hash (không hiển thị plain text)

**Error Cases:**
- ❌ Username đã tồn tại: "Tên đăng nhập đã tồn tại"
- ❌ Password < 6 ký tự: "Mật khẩu phải có ít nhất 6 ký tự"

---

---

## 🎯 KỊCH BẢN 2: QUYỀN KẾ TOÁN - QUẢN LÝ HÓA ĐƠN

### PHẦN 1: ĐĂNG NHẬP & QUYỀN HẠN (5 phút)

#### Bước 1.1: Đăng Nhập Kế Toán
**Actions:**
```
1. Logout khỏi tài khoản Admin
2. Login với:
   - Username: ketoan01
   - Password: 123456
```

**Expected Result:**
- ✅ Đăng nhập thành công
- ✅ Header hiển thị: "Xin chào, Nguyễn Văn Kế Toán"
- ✅ Menu **CHỈ** hiển thị:
  - Trang chủ
  - Quản lý hóa đơn
  - Thống kê
- ✅ **KHÔNG** hiển thị:
  - Quản lý người dùng
  - Quản lý món ăn
  - Quản lý đặt tiệc

**Note:** Đây là demo về RBAC - Role-Based Access Control.

---

#### Bước 1.2: Thử Truy Cập Trang Không Có Quyền
**Actions:**
```
1. Thủ công nhập URL: http://localhost:5173/users
2. Enter
```

**Expected Result:**
- ❌ **Bị chặn:** Redirect về `/home`
- ❌ Thông báo: "Bạn không có quyền truy cập chức năng này"

**Related Files:**
- Frontend: `src/App.jsx` (WithPermission HOC)
- Component: `src/components/WithPermission.jsx`

---

### PHẦN 2: QUẢN LÝ HÓA ĐƠN (10 phút)

#### Bước 2.1: Xem Danh Sách Hóa Đơn
**Actions:**
```
1. Click menu "Quản lý hóa đơn"
2. Xem danh sách
```

**Expected Result:**
- ✅ Hiển thị tất cả hóa đơn
- ✅ Filter theo trạng thái: Tất cả / Chưa thanh toán / Đã thanh toán / Quá hạn
- ✅ Search theo tên chú rể, cô dâu
- ✅ Có button "Chi tiết", "Thanh toán" (nếu chưa thanh toán)

---

#### Bước 2.2: Xem Chi Tiết Hóa Đơn
**Actions:**
```
1. Click "Chi tiết" hóa đơn đầu tiên
```

**Expected Result:**
- ✅ Modal hiển thị đầy đủ:
  ```
  ───────────────────────────────────
  THÔNG TIN KHÁCH HÀNG
  Chú rể: Nguyễn Văn A
  Cô dâu: Trần Thị B
  Điện thoại: 0901234567
  
  ───────────────────────────────────
  THÔNG TIN TIỆC
  Ngày đại tiệc: 14/02/2025
  Ca: Tối (18:00 - 22:00)
  Sảnh: VIP Hall
  Số lượng bàn: 40 + 2 (dự trữ)
  
  ───────────────────────────────────
  THỰC ĐƠN
  1. Tôm Hùm Alaska
  2. Bò Úc nướng
  3. Cá Hồi sốt cam
  ...
  
  ───────────────────────────────────
  DỊCH VỤ
  1. Trang trí sân khấu VIP - 5,000,000 đ
  2. MC chuyên nghiệp - 3,000,000 đ
  3. Ban nhạc acoustic - 8,000,000 đ
  
  ───────────────────────────────────
  CHI TIẾT THANH TOÁN
  Tổng tiền bàn:        189,000,000 đ
  Tổng tiền dịch vụ:     16,000,000 đ
  ─────────────────────────────────
  Tổng tiền hóa đơn:    205,000,000 đ
  
  Tiền đặt cọc:         -50,000,000 đ
  Tiền phạt (3 ngày):     6,150,000 đ
  ─────────────────────────────────
  TỔNG TIỀN CÒN LẠI:    161,150,000 đ
  
  Trạng thái: Đã thanh toán ✅
  Ngày thanh toán: 17/02/2025
  ```

**Related Files:**
- Frontend: `src/pages/InvoiceManagement.jsx` (Modal component)

---

#### Bước 2.3: Thanh Toán Hóa Đơn Chưa Thanh Toán
**Actions:**
```
1. Filter "Chưa thanh toán"
2. Chọn 1 hóa đơn
3. Click "Thanh toán"
4. Confirm
```

**Expected Result:**
- ✅ Thông báo: "Thanh toán hóa đơn thành công"
- ✅ Status update: "Chưa thanh toán" → "Đã thanh toán"
- ✅ Hóa đơn biến mất khỏi filter "Chưa thanh toán"

---

### PHẦN 3: XEM THỐNG KÊ (5 phút)

#### Bước 3.1: Truy Cập Trang Thống Kê
**Actions:**
```
1. Click menu "Thống kê"
```

**Expected Result:**
- ✅ Truy cập thành công (có quyền)
- ✅ Hiển thị đầy đủ báo cáo doanh thu
- ✅ Có thể xem, filter, nhưng **KHÔNG THỂ** tạo/sửa/xóa báo cáo

**Note:** Kế toán có quyền XEM thống kê, không có quyền QUẢN LÝ.

---

---

## ⚠️ CÁC TÌNH HUỐNG LỖI & XỬ LÝ

### 1. Lỗi Xác Thực (Authentication)

#### 1.1. Token Hết Hạn
**Scenario:**
- User đăng nhập, để idle > 1 giờ
- Click vào bất kỳ chức năng nào

**Expected Result:**
- ✅ Auto refresh token (không có popup)
- ✅ Request retry tự động
- ✅ User không bị interrupt

**If Refresh Token cũng hết hạn:**
- ❌ Redirect về `/login`
- ❌ Thông báo: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"

**Related Code:**
```javascript
// frontend/src/services/api.js
const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (response.status === 401) {
      // Token expired, try refresh
      const newToken = await refreshToken();
      if (newToken) {
        // Retry request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          }
        });
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};
```

---

### 2. Lỗi Phân Quyền (Authorization)

#### 2.1. Truy Cập Route Không Có Quyền
**Scenario:**
- User Kế toán thử truy cập `/users`

**Expected Result:**
- ❌ Redirect về `/home`
- ❌ Thông báo: "Bạn không có quyền truy cập chức năng này"

#### 2.2. Call API Không Có Quyền
**Scenario:**
- User Kế toán thử call `POST /api/monan/create`

**Expected Result:**
- ❌ Status 403 Forbidden
- ❌ Response: `{ success: false, message: "Ban khong co quyen truy cap chuc nang nay" }`

---

### 3. Lỗi Validation

#### 3.1. Tạo Món Ăn - Tên Trùng
**Request:**
```javascript
POST /api/monan/create
{
  "tenMonAn": "Tôm Hùm Alaska", // Đã tồn tại
  "maLoaiMonAn": 1,
  "donGia": 350000
}
```

**Response:**
```json
{
  "success": false,
  "message": "Ten mon an da ton tai",
  "error": "DUPLICATE_DISH_NAME"
}
```

#### 3.2. Đặt Tiệc - Tiền Cọc < 15%
**Request:**
```javascript
POST /api/dattiec/create
{
  "tongTienDuKien": 200000000,
  "tienDatCoc": 20000000  // Chỉ 10%
}
```

**Response:**
```json
{
  "success": false,
  "message": "Tien dat coc phai >= 15% tong tien du kien",
  "error": "INSUFFICIENT_DEPOSIT"
}
```

#### 3.3. Đặt Tiệc - Số Bàn Vượt Quá
**Request:**
```javascript
POST /api/dattiec/create
{
  "maSanh": 1,  // Sảnh có max 30 bàn
  "soLuongBan": 28,
  "soBanDuTru": 5  // Tổng = 33 > 30
}
```

**Response:**
```json
{
  "success": false,
  "message": "So luong ban vuot qua so ban toi da cua sanh",
  "error": "EXCEED_MAX_TABLES"
}
```

#### 3.4. Đặt Tiệc - Giá Bàn < Đơn Giá Tối Thiểu
**Request:**
```javascript
POST /api/dattiec/create
{
  "maSanh": 2,  // Sảnh VIP: đơn giá tối thiểu 5,000,000 đ/bàn
  "soLuongBan": 40,
  "tongTienDuKien": 180000000  // 4,500,000 đ/bàn
}
```

**Response:**
```json
{
  "success": false,
  "message": "Gia ban (4,500,000) phai >= don gia toi thieu (5,000,000)",
  "error": "BELOW_MIN_TABLE_PRICE"
}
```

---

### 4. Lỗi Business Logic

#### 4.1. Xóa Món Ăn Đang Được Sử Dụng
**Scenario:**
- Món "Tôm Hùm Alaska" đang có trong thực đơn của 3 đặt tiệc chưa thanh toán
- Admin thử xóa món này

**Expected Result:**
- ❌ Thông báo: "Món ăn đang được sử dụng trong đặt tiệc, không thể xóa"
- ✅ Món ăn vẫn tồn tại

**Related Code:**
```javascript
// backend/src/services/monan.services.js
export const validateDishDeletion = async (maMonAn) => {
  const usageCheck = await db('THUCDON_MONAN')
    .join('THUCDON', 'THUCDON_MONAN.MaThucDon', 'THUCDON.MaThucDon')
    .join('DATTIEC', 'THUCDON.MaThucDon', 'DATTIEC.MaThucDon')
    .leftJoin('HOADON', 'DATTIEC.MaDatTiec', 'HOADON.MaDatTiec')
    .where('THUCDON_MONAN.MaMonAn', maMonAn)
    .where(function() {
      this.whereNull('HOADON.MaHoaDon')  // Chưa có hóa đơn
          .orWhere('HOADON.TrangThai', '!=', 1);  // Hoặc chưa thanh toán
    })
    .first();

  if (usageCheck) {
    throw new Error('Mon an dang duoc su dung trong dat tiec, khong the xoa');
  }
};
```

#### 4.2. Xóa Sảnh Đang Được Đặt
**Similar logic với món ăn**

#### 4.3. Tạo Hóa Đơn Cho Đặt Tiệc Đã Có Hóa Đơn
**Scenario:**
- Đặt tiệc đã có hóa đơn
- Thử tạo hóa đơn lần 2

**Expected Result:**
- ❌ Thông báo: "Đặt tiệc này đã có hóa đơn"

---

### 5. Lỗi Kết Nối

#### 5.1. Backend Offline
**Scenario:**
- Backend server không chạy
- User thử login

**Expected Result:**
- ❌ Thông báo: "Không thể kết nối đến server. Vui lòng thử lại sau."
- ✅ Spinner loading biến mất
- ✅ Form vẫn có thể nhập lại

#### 5.2. Database Offline
**Scenario:**
- PostgreSQL không chạy
- User thử tạo món ăn

**Backend Response:**
```json
{
  "success": false,
  "message": "Loi ket noi co so du lieu",
  "error": "DATABASE_CONNECTION_ERROR"
}
```

**Frontend Display:**
- ❌ Thông báo: "Hệ thống đang bảo trì. Vui lòng thử lại sau."

---

### 6. Lỗi Rate Limiting

#### 6.1. Spam Request
**Scenario:**
- User click "Tạo món ăn" liên tục 10 lần trong 1 phút

**Expected Result (sau lần thứ 6):**
- ❌ Status 429 Too Many Requests
- ❌ Response:
```json
{
  "success": false,
  "message": "Qua nhieu request, vui long thu lai sau 60 giay"
}
```

**Related Code:**
```javascript
// backend/src/middleware/ratelimit.middleware.js
export const createLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests
  message: 'Qua nhieu request, vui long thu lai sau'
});
```

---

---

## ✅ CHECKLIST DEMO

### Pre-Demo
- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Database có đầy đủ data mẫu
- [ ] Clear browser cache
- [ ] Mở 2 tab: Admin & Kế toán
- [ ] Test tất cả tính năng 1 lần để đảm bảo không lỗi

### During Demo - Admin Flow
- [ ] ✅ Login Admin thành công
- [ ] ✅ Hiển thị đầy đủ menu (6 items)
- [ ] ✅ Tạo món ăn mới
- [ ] ✅ Tạo thực đơn mẫu
- [ ] ✅ Thêm món vào thực đơn mẫu
- [ ] ✅ Demo validation: Tên món trùng (lỗi)
- [ ] ✅ Demo validation: Xóa sảnh đang dùng (lỗi)
- [ ] ✅ Tạo đặt tiệc mới
- [ ] ✅ Thêm dịch vụ cho đặt tiệc
- [ ] ✅ Demo validation: Trùng lịch (lỗi)
- [ ] ✅ Demo validation: Tiền cọc < 15% (lỗi)
- [ ] ✅ Tạo hóa đơn không phạt
- [ ] ✅ Tạo hóa đơn có phạt (trễ 3 ngày)
- [ ] ✅ Giải thích logic tính phạt
- [ ] ✅ Thanh toán hóa đơn
- [ ] ✅ Tạo báo cáo doanh thu tháng
- [ ] ✅ Xem chi tiết báo cáo (table + chart)
- [ ] ✅ Filter báo cáo theo ngày
- [ ] ✅ Tạo user Kế toán mới

### During Demo - Kế Toán Flow
- [ ] ✅ Logout Admin
- [ ] ✅ Login Kế toán thành công
- [ ] ✅ Menu chỉ hiển thị 3 items (Home, Hóa đơn, Thống kê)
- [ ] ✅ Thử truy cập `/users` (bị chặn)
- [ ] ✅ Xem danh sách hóa đơn
- [ ] ✅ Xem chi tiết hóa đơn
- [ ] ✅ Thanh toán hóa đơn
- [ ] ✅ Truy cập trang thống kê (thành công)

### Error Scenarios Demonstrated
- [ ] ✅ Login sai password
- [ ] ✅ Tên món ăn trùng
- [ ] ✅ Xóa resource đang được sử dụng
- [ ] ✅ Đặt tiệc trùng lịch
- [ ] ✅ Tiền cọc < 15%
- [ ] ✅ Số bàn vượt quá max
- [ ] ✅ Giá bàn < đơn giá tối thiểu
- [ ] ✅ Truy cập route không có quyền

### Security Features Highlighted
- [ ] ✅ JWT token authentication
- [ ] ✅ Auto token refresh (transparent)
- [ ] ✅ RBAC (role-based access control)
- [ ] ✅ Input validation (Joi)
- [ ] ✅ SQL injection prevention
- [ ] ✅ Rate limiting

---

## 🎤 SCRIPT THUYẾT TRÌNH MẪU

### Opening (1 phút)
```
"Xin chào mọi người. Hôm nay em xin demo hệ thống quản lý tiệc cưới Everlasting.

Hệ thống được xây dựng với:
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT với auto token refresh
- Authorization: RBAC với 6 roles khác nhau

Em sẽ demo 2 workflows chính:
1. Quyền Admin - Quản lý toàn diện từ A-Z
2. Quyền Kế toán - Chỉ quản lý hóa đơn

Và các tình huống lỗi, validation để đảm bảo data integrity."
```

### Admin Demo (15-20 phút)
```
"Bây giờ em sẽ đăng nhập với quyền Admin...

[Thực hiện các bước trong Kịch bản 1]

Như các bạn thấy, Admin có đầy đủ quyền để:
- Quản lý món ăn, thực đơn
- Quản lý sảnh, ca
- Quản lý đặt tiệc
- Quản lý hóa đơn
- Xem thống kê

Điểm đặc biệt là hệ thống có validation rất chặt chẽ:
- Không thể xóa resource đang được sử dụng
- Không thể đặt trùng lịch
- Tiền cọc phải >= 15%
- Giá bàn phải >= đơn giá tối thiểu
..."
```

### Kế Toán Demo (5-10 phút)
```
"Tiếp theo, em sẽ demo quyền Kế toán để show case hệ thống RBAC...

[Thực hiện các bước trong Kịch bản 2]

Như các bạn thấy, Kế toán chỉ có quyền:
- Xem và thanh toán hóa đơn
- Xem thống kê (read-only)

Không thể truy cập:
- Quản lý người dùng
- Quản lý món ăn
- Quản lý đặt tiệc

Khi thử truy cập route không có quyền, hệ thống sẽ redirect về home."
```

### Closing (2 phút)
```
"Tóm lại, hệ thống Everlasting có các tính năng chính:

✅ Quản lý toàn diện: Món ăn, Thực đơn, Sảnh, Ca, Đặt tiệc, Hóa đơn
✅ Tính toán tự động: Tổng tiền, Tiền phạt, Doanh thu
✅ Báo cáo chi tiết: Doanh thu theo tháng, ngày, tỷ lệ
✅ Phân quyền chặt chẽ: RBAC với 6 roles
✅ Validation đầy vào: Đảm bảo data integrity
✅ Security: JWT, auto refresh, rate limiting

Em xin kết thúc phần demo. Cảm ơn mọi người đã theo dõi!"
```

---

**Document Version:** 1.0  
**Date:** December 28, 2025  
**Author:** Demo Script Team
