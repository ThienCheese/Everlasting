# Phân Tích Chi Tiết Quy Trình Quản Lý Tiệc Cưới - Everlasting

## Tổng Quan
Tài liệu này phân tích chi tiết quy trình một Admin đăng nhập và thực hiện các thao tác từ A-Z trong hệ thống quản lý tiệc cưới Everlasting.

---

## 1. ĐĂNG NHẬP (LOGIN)

### 1.1. Frontend - Giao diện đăng nhập

**File:** `frontend/src/pages/login.jsx`

**Component chịu trách nhiệm:** Component `Login`

**Quy trình:**
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await apiService.login(username, password);
    // Lưu tokens
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    // Navigate đến trang chủ
    navigate('/home');
  } catch (error) {
    alert('Đăng nhập thất bại: ' + error.message);
  }
};
```

### 1.2. API Service

**File:** `frontend/src/services/api.js`

**Function:** `apiService.login(tenDangNhap, matKhau)`

**Request:**
```javascript
POST http://localhost:3000/api/nguoidung/login
Content-Type: application/json

{
  "tenDangNhap": "admin",
  "matKhau": "admin123"
}
```

### 1.3. Backend - Route Handler

**File:** `backend/src/routes/index.js`
```javascript
router.use('/nguoidung', userRoutes);
```

**File:** `backend/src/routes/nguoidung.routes.js`
```javascript
router.post('/login', login);
```

### 1.4. Backend - Controller

**File:** `backend/src/controller/nguoidung.controller.js`

**Function:** `login(req, res)`

**Xử lý:**
1. Validate input (tenDangNhap, matKhau)
2. Tìm user trong database: `User.findByUsername(tenDangNhap)`
3. So sánh password: `comparePassword(matKhau, user.MatKhau)`
4. Generate tokens:
   - Access Token (JWT, expire 1h): `generateAccessToken(user)`
   - Refresh Token (UUID): `generateRefreshToken()`
5. Lưu refresh token vào DB: `saveRefreshToken(user.MaNguoiDung, refreshToken)`

**Model sử dụng:**

**File:** `backend/src/models/nguoidung.model.js`

```javascript
async findByUsername(username) {
  return db('NGUOIDUNG')
    .select('NGUOIDUNG.*', 'NHOMNGUOIDUNG.TenNhom')
    .leftJoin('NHOMNGUOIDUNG', 'NGUOIDUNG.MaNhom', 'NHOMNGUOIDUNG.MaNhom')
    .where({ TenDangNhap: username })
    .first();
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "Administrator",
      "maNhom": 1
    }
  }
}
```

---

## 2. THÊM MÓN ĂN MỚI

### 2.1. Frontend - Giao diện quản lý món ăn

**File:** `frontend/src/pages/MenuManagement.jsx`

**Component chịu trách nhiệm:** Component `MenuManagement`

**State quản lý form:**
```javascript
const [editingMonAn, setEditingMonAn] = useState({
  tenMonAn: 'Tôm Hùm Alaska',
  maLoaiMonAn: 1, // 1 = Hải sản
  donGia: 350000,
  ghiChu: 'Tôm hùm tươi sống, nướng bơ tỏi',
  anhURL: 'https://example.com/tom-hum.jpg'
});
```

**Handler:**
```javascript
const handleSaveMonAn = async () => {
  try {
    const payload = {
      tenMonAn: editingMonAn.tenMonAn,
      maLoaiMonAn: editingMonAn.maLoaiMonAn,
      donGia: editingMonAn.donGia,
      ghiChu: editingMonAn.ghiChu,
      anhURL: editingMonAn.anhURL
    };

    await apiService.createMonAn(payload);
    alert('Tạo món ăn thành công!');
    fetchMonAn(); // Reload danh sách
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};
```

### 2.2. API Service

**File:** `frontend/src/services/api.js`

**Function:** `apiService.createMonAn(data)`

**Request:**
```javascript
POST http://localhost:3000/api/monan/create
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "tenMonAn": "Tôm Hùm Alaska",
  "maLoaiMonAn": 1,
  "donGia": 350000,
  "ghiChu": "Tôm hùm tươi sống, nướng bơ tỏi",
  "anhURL": "https://example.com/tom-hum.jpg"
}
```

### 2.3. Backend - Route & Middleware

**File:** `backend/src/routes/monan.routes.js`

```javascript
router.post('/create', 
  authMiddleware,                    // Kiểm tra JWT token
  requirePermission('QUAN_LY_MON_AN'), // Kiểm tra quyền
  createLimiter,                     // Rate limiting
  validateCreateDish,                // Validate dữ liệu
  auditLogger('DISH_CREATE'),        // Log audit trail
  createDish                         // Controller
);
```

**Middleware chain:**

1. **authMiddleware** (`backend/src/middleware/auth.middleware.js`):
   - Verify JWT token
   - Decode user info
   - Gán `req.user`

2. **requirePermission** (`backend/src/middleware/authorization.middleware.js`):
   - Kiểm tra user có quyền 'QUAN_LY_MON_AN' không
   - Admin (MaNhom=1) có tất cả quyền

3. **validateCreateDish** (`backend/src/middleware/validations/validateMonAn.js`):
   ```javascript
   export const createDishSchema = Joi.object({
     tenMonAn: Joi.string().trim().min(2).max(200).required(),
     maLoaiMonAn: Joi.number().integer().positive().required(),
     donGia: Joi.number().precision(2).min(0).required(),
     ghiChu: Joi.string().allow('', null).max(500),
     anhURL: Joi.string().uri().allow('', null)
   });
   ```

### 2.4. Backend - Controller

**File:** `backend/src/controller/monan.controller.js`

**Function:** `createDish(req, res)`

**Xử lý:**
1. Extract data từ `req.body`
2. Validate business logic: `validateDishCreation(tenMonAn, maLoaiMonAn)`
   - Kiểm tra tên món đã tồn tại chưa
   - Kiểm tra loại món ăn có tồn tại không
3. Insert vào database: `Dish.create({...})`

**Service validation:**

**File:** `backend/src/services/monan.services.js`

```javascript
export const validateDishCreation = async (tenMonAn, maLoaiMonAn) => {
  // Kiểm tra trùng tên
  const existing = await Dish.findByTenMonAn(tenMonAn);
  if (existing) {
    throw new Error('Ten mon an da ton tai');
  }

  // Kiểm tra loại món
  const loaiMon = await LoaiMonAn.findById(maLoaiMonAn);
  if (!loaiMon) {
    throw new Error('Loai mon an khong ton tai');
  }
};
```

**Model:**

**File:** `backend/src/models/monan.model.js`

```javascript
async create(data) {
  const [dish] = await db('MONAN')
    .insert({
      TenMonAn: data.TenMonAn,
      MaLoaiMonAn: data.MaLoaiMonAn,
      DonGia: data.DonGia,
      GhiChu: data.GhiChu,
      AnhURL: data.AnhURL,
      DaXoa: false
    })
    .returning('*');
  
  return dish;
}
```

**Database Query:**
```sql
INSERT INTO "MONAN" (
  "TenMonAn", 
  "MaLoaiMonAn", 
  "DonGia", 
  "GhiChu", 
  "AnhURL", 
  "DaXoa"
) VALUES (
  'Tôm Hùm Alaska',
  1,
  350000,
  'Tôm hùm tươi sống, nướng bơ tỏi',
  'https://example.com/tom-hum.jpg',
  false
) RETURNING *;
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo món ăn thành công",
  "data": {
    "MaMonAn": 25,
    "TenMonAn": "Tôm Hùm Alaska",
    "MaLoaiMonAn": 1,
    "DonGia": 350000,
    "GhiChu": "Tôm hùm tươi sống, nướng bơ tỏi",
    "AnhURL": "https://example.com/tom-hum.jpg",
    "DaXoa": false
  }
}
```

---

## 3. THÊM MÓN VÀO THỰC ĐƠN MẪU

### 3.1. Frontend - Giao diện thực đơn mẫu

**File:** `frontend/src/pages/MenuManagement.jsx`

**State:**
```javascript
const [selectedThucDonMau, setSelectedThucDonMau] = useState({
  MaThucDon: 3,
  TenThucDon: "Set Tiệc VIP"
});
const [monAnInThucDonMau, setMonAnInThucDonMau] = useState([]);
```

**Handler thêm món:**
```javascript
const handleAddMonAnToThucDonMau = async (maMonAn) => {
  if (!selectedThucDonMau) return;
  
  try {
    await apiService.addMonAnToThucDonMau(
      selectedThucDonMau.MaThucDon, 
      maMonAn
    );
    
    // Reload danh sách món trong thực đơn mẫu
    const response = await apiService.getMonAnThucDonMau(
      selectedThucDonMau.MaThucDon
    );
    setMonAnInThucDonMau(response.data);
    
    alert('Thêm món ăn vào thực đơn mẫu thành công!');
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};
```

### 3.2. API Service

**File:** `frontend/src/services/api.js`

**Request:**
```javascript
POST http://localhost:3000/api/thucdonmau/3/monan
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "maMonAn": 25
}
```

### 3.3. Backend - Route

**File:** `backend/src/routes/thucdonmau.routes.js`

```javascript
router.post('/:id/monan', 
  authMiddleware, 
  requireAdmin,
  validateIdParam('id'), 
  validateAddMonAnToTemplate, 
  auditLogger('THUCDONMAU_ADD_MONAN'), 
  async (req, res) => {
    // Handler inline
  }
);
```

### 3.4. Backend - Handler

**Xử lý:**
1. Validate thực đơn mẫu tồn tại
2. Validate món ăn tồn tại
3. Kiểm tra món đã có trong thực đơn chưa
4. Insert vào bảng `CHITIET_THUCDONMAU`

**Model:**

**File:** `backend/src/models/thucdonmau.model.js`

```javascript
async addMonAn(maThucDon, maMonAn) {
  // Kiểm tra món ăn đã tồn tại chưa
  const existing = await db('CHITIET_THUCDONMAU')
    .where({ MaThucDon: maThucDon, MaMonAn: maMonAn })
    .first();
    
  if (existing) {
    throw new Error('Mon an da ton tai trong thuc don mau');
  }

  // Thêm món ăn
  return await db('CHITIET_THUCDONMAU').insert({
    MaThucDon: maThucDon,
    MaMonAn: maMonAn
  });
}
```

**Database Query:**
```sql
INSERT INTO "CHITIET_THUCDONMAU" ("MaThucDon", "MaMonAn")
VALUES (3, 25);
```

**Response:**
```json
{
  "success": true,
  "message": "Them mon an vao thuc don mau thanh cong",
  "data": null
}
```

---

## 4. ĐẶT TIỆC

### 4.1. Frontend - Form đặt tiệc

**File:** `frontend/src/pages/ManagerBooking.jsx`

**State form:**
```javascript
const [bookingData, setBookingData] = useState({
  tenChuRe: 'Nguyễn Văn A',
  tenCoDau: 'Trần Thị B',
  dienThoai: '0901234567',
  ngayDaiTiec: '2025-02-14',
  maCa: 1,        // Ca sáng
  maSanh: 2,      // Sảnh VIP
  maThucDon: 3,   // Set Tiệc VIP (vừa tạo)
  tienDatCoc: 50000000,
  tongTienDuKien: 200000000,
  soLuongBan: 40,
  soBanDuTru: 2
});
```

**Handler:**
```javascript
const handleCreateBooking = async () => {
  try {
    const payload = {
      tenChuRe: bookingData.tenChuRe,
      tenCoDau: bookingData.tenCoDau,
      dienThoai: bookingData.dienThoai,
      ngayDatTiec: new Date().toISOString().split('T')[0],
      ngayDaiTiec: bookingData.ngayDaiTiec,
      maCa: bookingData.maCa,
      maSanh: bookingData.maSanh,
      maThucDon: bookingData.maThucDon,
      tienDatCoc: bookingData.tienDatCoc,
      tongTienDuKien: bookingData.tongTienDuKien,
      soLuongBan: bookingData.soLuongBan,
      soBanDuTru: bookingData.soBanDuTru
    };

    await apiService.createDatTiec(payload);
    alert('Đặt tiệc thành công!');
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};
```

### 4.2. API Service

**Request:**
```javascript
POST http://localhost:3000/api/dattiec/create
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "tenChuRe": "Nguyễn Văn A",
  "tenCoDau": "Trần Thị B",
  "dienThoai": "0901234567",
  "ngayDatTiec": "2025-12-28",
  "ngayDaiTiec": "2025-02-14",
  "maCa": 1,
  "maSanh": 2,
  "maThucDon": 3,
  "tienDatCoc": 50000000,
  "tongTienDuKien": 200000000,
  "soLuongBan": 40,
  "soBanDuTru": 2
}
```

### 4.3. Backend - Route & Middleware

**File:** `backend/src/routes/dattiec.routes.js`

```javascript
router.post('/create', 
  authMiddleware,
  requirePermission('QUAN_LY_DAT_TIEC'),
  bookingLimiter,
  validateCreateDatTiec,
  validateMinTablePrice,  // Validate giá bàn >= giá tối thiểu
  auditLogger('DATTIEC_CREATE'),
  createDatTiec
);
```

**Validation middleware:**

**File:** `backend/src/middleware/validations/validateDatTiec.js`

**Validate MinTablePrice:**
```javascript
export const validateMinTablePrice = async (req, res, next) => {
  const { maSanh, tongTienDuKien, soLuongBan } = req.body;

  // Lấy thông tin sảnh
  const sanh = await Hall.findById(maSanh);
  if (!sanh) {
    return errorResponse(res, 'Sanh khong ton tai', 404);
  }

  // Tính giá 1 bàn
  const giaBan = Number(tongTienDuKien) / Number(soLuongBan);
  const donGiaBanToiThieu = Number(sanh.DonGiaBanToiThieu);

  // Kiểm tra
  if (giaBan < donGiaBanToiThieu) {
    return errorResponse(res, 
      `Gia ban (${giaBan.toLocaleString('vi-VN')}) phai >= don gia toi thieu (${donGiaBanToiThieu.toLocaleString('vi-VN')})`, 
      400
    );
  }

  next();
};
```

### 4.4. Backend - Controller

**File:** `backend/src/controller/dattiec.controller.js`

**Function:** `createDatTiec(req, res)`

**Service validation:**

**File:** `backend/src/services/dattiec.services.js`

```javascript
export const validateDatTiecCreation = async (data) => {
  // 1. Validate Ca tồn tại
  const ca = await Ca.findById(data.maCa);
  if (!ca) throw new Error('Ca khong ton tai');

  // 2. Validate Sảnh tồn tại
  const sanh = await Sanh.findById(data.maSanh);
  if (!sanh) throw new Error('Sanh khong ton tai');

  // 3. Validate Thực đơn tồn tại
  const thucDon = await ThucDon.findById(data.maThucDon);
  if (!thucDon) throw new Error('Thuc don khong ton tai');

  // 4. Validate số bàn <= số bàn tối đa
  const tongSoBan = data.soLuongBan + data.soBanDuTru;
  if (tongSoBan > sanh.SoLuongBanToiDa) {
    throw new Error('So luong ban vuot qua so ban toi da cua sanh');
  }

  // 5. Kiểm tra trùng lịch (ngày + ca + sảnh)
  const conflict = await DatTiec.checkConflict(
    data.ngayDaiTiec, 
    data.maCa, 
    data.maSanh
  );
  
  if (conflict) {
    throw new Error('Sanh da duoc dat vao thoi gian nay');
  }

  // 6. Validate tiền đặt cọc >= 15% tổng tiền
  const minDeposit = data.tongTienDuKien * 0.15;
  if (data.tienDatCoc < minDeposit) {
    throw new Error('Tien dat coc phai >= 15% tong tien du kien');
  }
};
```

**Model:**

**File:** `backend/src/models/dattiec.model.js`

```javascript
async create(data) {
  const [datTiec] = await db('DATTIEC')
    .insert({
      TenChuRe: data.TenChuRe,
      TenCoDau: data.TenCoDau,
      DienThoai: data.DienThoai,
      NgayDatTiec: data.NgayDatTiec || new Date(),
      NgayDaiTiec: data.NgayDaiTiec,
      MaCa: data.MaCa,
      MaSanh: data.MaSanh,
      MaThucDon: data.MaThucDon,
      TienDatCoc: data.TienDatCoc,
      SoLuongBan: data.SoLuongBan,
      SoBanDuTru: data.SoBanDuTru || 0,
      DaHuy: false
    })
    .returning('*');
  
  return datTiec;
}
```

**Database Query:**
```sql
INSERT INTO "DATTIEC" (
  "TenChuRe", "TenCoDau", "DienThoai",
  "NgayDatTiec", "NgayDaiTiec",
  "MaCa", "MaSanh", "MaThucDon",
  "TienDatCoc", "SoLuongBan", "SoBanDuTru", "DaHuy"
) VALUES (
  'Nguyễn Văn A', 'Trần Thị B', '0901234567',
  '2025-12-28', '2025-02-14',
  1, 2, 3,
  50000000, 40, 2, false
) RETURNING *;
```

**Response:**
```json
{
  "success": true,
  "message": "Tao dat tiec thanh cong",
  "data": {
    "MaDatTiec": 15,
    "TenChuRe": "Nguyễn Văn A",
    "TenCoDau": "Trần Thị B",
    "DienThoai": "0901234567",
    "NgayDatTiec": "2025-12-28",
    "NgayDaiTiec": "2025-02-14",
    "MaCa": 1,
    "MaSanh": 2,
    "MaThucDon": 3,
    "TienDatCoc": 50000000,
    "SoLuongBan": 40,
    "SoBanDuTru": 2,
    "DaHuy": false
  }
}
```

---

## 5. TẠO HÓA ĐƠN VỚI PHẠT TRỄ 3 NGÀY

### 5.1. Frontend - Form tạo hóa đơn

**File:** `frontend/src/pages/InvoiceManagement.jsx`

**State:**
```javascript
const [paymentData, setPaymentData] = useState({
  ngayThanhToan: '2025-02-17', // Trễ 3 ngày (14/2 + 3 = 17/2)
  apDungQuyDinhPhat: true      // Checkbox được tick
});

const [selectedDatTiec, setSelectedDatTiec] = useState({
  MaDatTiec: 15,
  TenChuRe: 'Nguyễn Văn A',
  TenCoDau: 'Trần Thị B',
  NgayDaiTiec: '2025-02-14'
});
```

**Handler:**
```javascript
const handleCreateInvoice = async () => {
  if (!selectedDatTiec) {
    alert('Vui lòng chọn đặt tiệc');
    return;
  }

  try {
    const hoaDonData = {
      maDatTiec: selectedDatTiec.MaDatTiec,
      ngayThanhToan: paymentData.ngayThanhToan,
      apDungQuyDinhPhat: paymentData.apDungQuyDinhPhat
    };

    await apiService.createHoaDon(hoaDonData);
    alert('Tạo hóa đơn thành công!');
    loadData();
  } catch (error) {
    alert('Lỗi khi tạo hóa đơn: ' + error.message);
  }
};
```

### 5.2. API Service

**Request:**
```javascript
POST http://localhost:3000/api/hoadon/create
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "maDatTiec": 15,
  "ngayThanhToan": "2025-02-17",
  "apDungQuyDinhPhat": true
}
```

### 5.3. Backend - Route

**File:** `backend/src/routes/hoadon.routes.js`

```javascript
router.post('/create', 
  authMiddleware, 
  createLimiter, 
  validateCreateHoaDon, 
  auditLogger('HOADON_CREATE'), 
  createHoaDon
);
```

### 5.4. Backend - Controller

**File:** `backend/src/controller/hoadon.controller.js`

**Function:** `createHoaDon(req, res)`

```javascript
export const createHoaDon = async (req, res) => {
  try {
    const { maDatTiec, ngayThanhToan, apDungQuyDinhPhat } = req.body;

    // Validate
    await validateHoaDonCreation(maDatTiec);

    // Tính toán hóa đơn
    const hoaDonData = await calculateHoaDon(
      maDatTiec, 
      ngayThanhToan, 
      apDungQuyDinhPhat
    );

    const hoaDon = await HoaDon.create({
      MaDatTiec: maDatTiec,
      NgayThanhToan: ngayThanhToan,
      NgayLapHoaDon: new Date(),
      ...hoaDonData
    });

    return successResponse(res, hoaDon, 'Tao hoa don thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
```

### 5.5. Service - Tính toán hóa đơn

**File:** `backend/src/services/hoadon.services.js`

**Function:** `calculateHoaDon(maDatTiec, ngayThanhToan, apDungQuyDinhPhat)`

**Chi tiết tính toán:**

```javascript
export const calculateHoaDon = async (maDatTiec, ngayThanhToan, apDungQuyDinhPhat = false) => {
  // 1. Lấy thông tin đặt tiệc
  const datTiec = await DatTiec.findById(maDatTiec);
  if (!datTiec) {
    throw new Error('Dat tiec khong ton tai');
  }

  // 2. Lấy thực đơn
  const thucDon = await ThucDon.findById(datTiec.MaThucDon);
  if (!thucDon) {
    throw new Error('Thuc don khong ton tai');
  }

  // 3. Tính tiền bàn
  // Tổng đơn giá thực đơn * (Số lượng bàn + Số bàn dự trữ)
  const tongTienBan = parseFloat(thucDon.TongDonGiaThoiDiemDat) 
                    * (datTiec.SoLuongBan + datTiec.SoBanDuTru);
  
  // Ví dụ: 
  // - TongDonGiaThoiDiemDat = 4,500,000 đ/bàn
  // - SoLuongBan = 40
  // - SoBanDuTru = 2
  // => tongTienBan = 4,500,000 * (40 + 2) = 189,000,000 đ

  // 4. Tính tiền dịch vụ
  const dichVuList = await DatTiec.getDichVu(maDatTiec);
  const tongTienDichVu = dichVuList.reduce(
    (sum, dv) => sum + parseFloat(dv.ThanhTien), 
    0
  );
  
  // Ví dụ:
  // - Dịch vụ 1: 5,000,000 đ
  // - Dịch vụ 2: 3,000,000 đ
  // => tongTienDichVu = 8,000,000 đ

  // 5. Tính tổng tiền hóa đơn (chưa có phạt)
  let tongTienHoaDon = tongTienBan + tongTienDichVu;
  // => tongTienHoaDon = 189,000,000 + 8,000,000 = 197,000,000 đ

  // 6. Tính phạt (nếu áp dụng quy định phạt)
  let tongTienPhat = 0;
  let phanTramPhatMotNgay = 0;

  if (apDungQuyDinhPhat) {
    // 6.1. Chuẩn hóa ngày để so sánh
    const ngayDaiTiec = new Date(datTiec.NgayDaiTiec);
    const ngayTT = new Date(ngayThanhToan);
    ngayDaiTiec.setHours(0, 0, 0, 0);
    ngayTT.setHours(0, 0, 0, 0);

    // 6.2. Kiểm tra thanh toán trễ
    if (ngayTT > ngayDaiTiec) {
      // 6.3. Lấy tham số phạt từ bảng THAMSO
      const thamSo = await ThamSo.get();
      if (thamSo) {
        phanTramPhatMotNgay = parseFloat(thamSo.PhanTramPhatTrenNgay);
        // Ví dụ: PhanTramPhatTrenNgay = 1.0 (1%/ngày)
      }

      // 6.4. Tính số ngày trễ
      const soNgayTre = Math.ceil(
        (ngayTT - ngayDaiTiec) / (1000 * 60 * 60 * 24)
      );
      // Ví dụ: 
      // - ngayDaiTiec = 2025-02-14
      // - ngayThanhToan = 2025-02-17
      // => soNgayTre = 3 ngày
      
      // 6.5. Công thức phạt
      // Tổng tiền hóa đơn * Phần trăm phạt 1 ngày * Số ngày trễ
      tongTienPhat = tongTienHoaDon * (phanTramPhatMotNgay / 100) * soNgayTre;
      // => tongTienPhat = 197,000,000 * (1 / 100) * 3 = 5,910,000 đ
    }
  }

  // 7. Tính tổng tiền còn lại
  // (Tổng hóa đơn + Tiền phạt - Tiền đặt cọc)
  const tongTienConLai = tongTienHoaDon + tongTienPhat 
                       - parseFloat(datTiec.TienDatCoc);
  
  // Ví dụ:
  // - tongTienHoaDon = 197,000,000
  // - tongTienPhat = 5,910,000
  // - TienDatCoc = 50,000,000
  // => tongTienConLai = 197,000,000 + 5,910,000 - 50,000,000 
  //                   = 152,910,000 đ

  // 8. Return data
  return {
    TongTienBan: tongTienBan,              // 189,000,000
    TongTienDichVu: tongTienDichVu,        // 8,000,000
    TongTienHoaDon: tongTienHoaDon,        // 197,000,000
    ApDungQuyDinhPhat: apDungQuyDinhPhat,  // true
    PhanTramPhatMotNgay: phanTramPhatMotNgay, // 1.0
    TongTienPhat: tongTienPhat,            // 5,910,000
    TongTienConLai: tongTienConLai,        // 152,910,000
    TrangThai: 0  // 0: Chưa thanh toán
  };
};
```

### 5.6. Model - Insert hóa đơn

**File:** `backend/src/models/hoadon.model.js`

```javascript
async create(data) {
  const [hoaDon] = await db('HOADON')
    .insert({
      MaDatTiec: data.MaDatTiec,
      NgayThanhToan: data.NgayThanhToan,
      NgayLapHoaDon: data.NgayLapHoaDon,
      TongTienBan: data.TongTienBan,
      TongTienDichVu: data.TongTienDichVu,
      TongTienHoaDon: data.TongTienHoaDon,
      ApDungQuyDinhPhat: data.ApDungQuyDinhPhat,
      PhanTramPhatMotNgay: data.PhanTramPhatMotNgay,
      TongTienPhat: data.TongTienPhat,
      TongTienConLai: data.TongTienConLai,
      TrangThai: data.TrangThai
    })
    .returning('*');
  
  return hoaDon;
}
```

**Database Query:**
```sql
INSERT INTO "HOADON" (
  "MaDatTiec",
  "NgayThanhToan",
  "NgayLapHoaDon",
  "TongTienBan",
  "TongTienDichVu",
  "TongTienHoaDon",
  "ApDungQuyDinhPhat",
  "PhanTramPhatMotNgay",
  "TongTienPhat",
  "TongTienConLai",
  "TrangThai"
) VALUES (
  15,
  '2025-02-17',
  '2025-12-28',
  189000000,
  8000000,
  197000000,
  true,
  1.0,
  5910000,
  152910000,
  0
) RETURNING *;
```

**Response:**
```json
{
  "success": true,
  "message": "Tao hoa don thanh cong",
  "data": {
    "MaHoaDon": 8,
    "MaDatTiec": 15,
    "NgayThanhToan": "2025-02-17",
    "NgayLapHoaDon": "2025-12-28",
    "TongTienBan": 189000000,
    "TongTienDichVu": 8000000,
    "TongTienHoaDon": 197000000,
    "ApDungQuyDinhPhat": true,
    "PhanTramPhatMotNgay": 1.0,
    "TongTienPhat": 5910000,
    "TongTienConLai": 152910000,
    "TrangThai": 0
  }
}
```

---

## 6. XEM THỐNG KÊ DOANH THU THÁNG

### 6.1. Frontend - Trang thống kê

**File:** `frontend/src/pages/Stats.jsx`

**State:**
```javascript
const [selectedMonth, setSelectedMonth] = useState(2);  // Tháng 2
const [selectedYear, setSelectedYear] = useState(2025);
const [baoCaoData, setBaoCaoData] = useState(null);
```

**Handler load báo cáo:**
```javascript
const loadBaoCao = async () => {
  try {
    setLoading(true);
    const response = await apiService.getBaoCaoByThangNam(
      selectedMonth, 
      selectedYear
    );
    setBaoCaoData(response.data);
  } catch (error) {
    if (error.message.includes('404')) {
      // Báo cáo chưa tồn tại, tạo mới
      await handleCreateBaoCao();
    } else {
      alert('Lỗi: ' + error.message);
    }
  } finally {
    setLoading(false);
  }
};

const handleCreateBaoCao = async () => {
  try {
    await apiService.createBaoCao(selectedMonth, selectedYear);
    // Reload sau khi tạo
    loadBaoCao();
  } catch (error) {
    alert('Lỗi khi tạo báo cáo: ' + error.message);
  }
};
```

### 6.2. API Service

**Request 1: Lấy báo cáo (nếu có)**
```javascript
GET http://localhost:3000/api/baocaodoanhso/thang/2/nam/2025
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request 2: Tạo báo cáo (nếu chưa có)**
```javascript
POST http://localhost:3000/api/baocaodoanhso/create
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "thang": 2,
  "nam": 2025
}
```

### 6.3. Backend - Route

**File:** `backend/src/routes/baocaodoanhso.routes.js`

```javascript
// Lấy báo cáo theo tháng/năm
router.get('/thang/:thang/nam/:nam', 
  authMiddleware, 
  requireAdmin, 
  getBaoCaoByThangNam
);

// Tạo báo cáo mới
router.post('/create', 
  authMiddleware, 
  requireAdmin, 
  createLimiter, 
  validateCreateBaoCao, 
  auditLogger('BAOCAO_CREATE'), 
  createBaoCao
);
```

### 6.4. Backend - Controller

**File:** `backend/src/controller/baocaodoanhso.controller.js`

**Function GET:** `getBaoCaoByThangNam(req, res)`

```javascript
export const getBaoCaoByThangNam = async (req, res) => {
  try {
    const { thang, nam } = req.params;
    
    let baoCao = await BaoCaoDoanhSo.findByThangNam(
      parseInt(thang), 
      parseInt(nam)
    );
    
    if (!baoCao) {
      return errorResponse(res, 'Bao cao khong ton tai', 404);
    }

    // Lấy chi tiết báo cáo (doanh thu từng ngày)
    const chiTiet = await BaoCaoDoanhSo.getChiTiet(
      baoCao.MaBaoCaoDoanhSo
    );
    baoCao.chiTiet = chiTiet;

    return successResponse(res, baoCao, 'Lay bao cao thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
```

**Function CREATE:** `createBaoCao(req, res)`

```javascript
export const createBaoCao = async (req, res) => {
  try {
    const { thang, nam } = req.body;

    // Kiểm tra đã có báo cáo chưa
    const existing = await BaoCaoDoanhSo.findByThangNam(thang, nam);
    if (existing) {
      return errorResponse(res, 'Bao cao thang nay da ton tai', 400);
    }

    // Tạo báo cáo
    const baoCao = await generateBaoCaoDoanhSo(thang, nam);

    return successResponse(res, baoCao, 'Tao bao cao thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
```

### 6.5. Service - Generate báo cáo

**File:** `backend/src/services/baocaodoanhso.services.js`

**Function:** `generateBaoCaoDoanhSo(thang, nam)`

**Chi tiết tính toán:**

```javascript
export const generateBaoCaoDoanhSo = async (thang, nam) => {
  // 1. Lấy tất cả hóa đơn đã thanh toán trong tháng
  const hoaDonList = await db('HOADON')
    .whereRaw('EXTRACT(MONTH FROM "NgayThanhToan") = ?', [thang])
    .whereRaw('EXTRACT(YEAR FROM "NgayThanhToan") = ?', [nam])
    .where('TrangThai', 1)  // 1 = Đã thanh toán
    .select('*');

  // 2. Tính tổng doanh thu
  const tongDoanhThu = hoaDonList.reduce((sum, hd) => {
    // Tổng tiền hóa đơn + Tiền phạt
    return sum + parseFloat(hd.TongTienHoaDon) + parseFloat(hd.TongTienPhat);
  }, 0);

  // Ví dụ với tháng 2/2025:
  // - Hóa đơn 1: 197,000,000 + 5,910,000 = 202,910,000
  // - Hóa đơn 2: 150,000,000 + 0 = 150,000,000
  // - Hóa đơn 3: 180,000,000 + 1,800,000 = 181,800,000
  // => tongDoanhThu = 534,710,000 đ

  // 3. Tạo báo cáo chính
  const [baoCao] = await db('BAOCAODOANHSO')
    .insert({
      Thang: thang,
      Nam: nam,
      TongDoanhThu: tongDoanhThu
    })
    .returning('*');

  // 4. Nhóm hóa đơn theo ngày
  const doanhThuTheoNgay = {};
  
  hoaDonList.forEach(hd => {
    const ngay = new Date(hd.NgayThanhToan).toISOString().split('T')[0];
    
    if (!doanhThuTheoNgay[ngay]) {
      doanhThuTheoNgay[ngay] = {
        soLuongTiec: 0,
        doanhThu: 0
      };
    }
    
    doanhThuTheoNgay[ngay].soLuongTiec += 1;
    doanhThuTheoNgay[ngay].doanhThu += 
      parseFloat(hd.TongTienHoaDon) + parseFloat(hd.TongTienPhat);
  });

  // Ví dụ:
  // {
  //   '2025-02-14': { soLuongTiec: 2, doanhThu: 352,910,000 },
  //   '2025-02-17': { soLuongTiec: 1, doanhThu: 181,800,000 }
  // }

  // 5. Tạo chi tiết báo cáo
  const chiTietRecords = Object.keys(doanhThuTheoNgay).map(ngay => {
    const { soLuongTiec, doanhThu } = doanhThuTheoNgay[ngay];
    const tiLe = (doanhThu / tongDoanhThu) * 100;
    
    return {
      MaBaoCaoDoanhSo: baoCao.MaBaoCaoDoanhSo,
      Ngay: ngay,
      SoLuongTiec: soLuongTiec,
      DoanhThu: doanhThu,
      TiLe: tiLe.toFixed(2)
    };
  });

  // Ví dụ chi tiết:
  // [
  //   {
  //     MaBaoCaoDoanhSo: 5,
  //     Ngay: '2025-02-14',
  //     SoLuongTiec: 2,
  //     DoanhThu: 352910000,
  //     TiLe: 66.00  // (352,910,000 / 534,710,000 * 100)
  //   },
  //   {
  //     MaBaoCaoDoanhSo: 5,
  //     Ngay: '2025-02-17',
  //     SoLuongTiec: 1,
  //     DoanhThu: 181800000,
  //     TiLe: 34.00
  //   }
  // ]

  // 6. Insert chi tiết
  if (chiTietRecords.length > 0) {
    await db('CHITIET_BAOCAODOANHSO').insert(chiTietRecords);
  }

  // 7. Return báo cáo với chi tiết
  baoCao.chiTiet = chiTietRecords;
  return baoCao;
};
```

### 6.6. Database Queries

**Query 1: Tạo báo cáo chính**
```sql
INSERT INTO "BAOCAODOANHSO" ("Thang", "Nam", "TongDoanhThu")
VALUES (2, 2025, 534710000)
RETURNING *;
```

**Query 2: Tạo chi tiết báo cáo**
```sql
INSERT INTO "CHITIET_BAOCAODOANHSO" 
  ("MaBaoCaoDoanhSo", "Ngay", "SoLuongTiec", "DoanhThu", "TiLe")
VALUES
  (5, '2025-02-14', 2, 352910000, 66.00),
  (5, '2025-02-17', 1, 181800000, 34.00);
```

**Response:**
```json
{
  "success": true,
  "message": "Tao bao cao doanh so thanh cong",
  "data": {
    "MaBaoCaoDoanhSo": 5,
    "Thang": 2,
    "Nam": 2025,
    "TongDoanhThu": 534710000,
    "chiTiet": [
      {
        "MaBaoCaoDoanhSo": 5,
        "Ngay": "2025-02-14",
        "SoLuongTiec": 2,
        "DoanhThu": 352910000,
        "TiLe": "66.00"
      },
      {
        "MaBaoCaoDoanhSo": 5,
        "Ngay": "2025-02-17",
        "SoLuongTiec": 1,
        "DoanhThu": 181800000,
        "TiLe": "34.00"
      }
    ]
  }
}
```

---

## TỔNG KẾT WORKFLOW

### Sơ đồ tổng quan luồng xử lý

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER (Admin)                                 │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐           │
│  │ Login.jsx   │  │ MenuMgmt.jsx │  │ InvoiceMgmt.jsx │           │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘           │
│         │                │                    │                      │
│         └────────────────┴────────────────────┘                      │
│                          │                                           │
│                 ┌────────▼─────────┐                                │
│                 │  api.js          │                                │
│                 │  - fetchWithAuth │                                │
│                 │  - Auto refresh  │                                │
│                 └────────┬─────────┘                                │
└──────────────────────────┼──────────────────────────────────────────┘
                           │ HTTP Request (JWT Token)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARE CHAIN                           │  │
│  │  1. authMiddleware      - Verify JWT                         │  │
│  │  2. requirePermission   - Check RBAC                         │  │
│  │  3. rateLimiter         - Prevent spam                       │  │
│  │  4. validate*           - Joi validation                     │  │
│  │  5. auditLogger         - Log actions                        │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    CONTROLLERS                              │    │
│  │  - nguoidung.controller.js                                  │    │
│  │  - monan.controller.js                                      │    │
│  │  - dattiec.controller.js                                    │    │
│  │  - hoadon.controller.js                                     │    │
│  │  - baocaodoanhso.controller.js                              │    │
│  └────────────────────────┬───────────────────────────────────┘    │
│                            │                                         │
│                            ▼                                         │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    SERVICES                                 │    │
│  │  - Business Logic Validation                                │    │
│  │  - Complex Calculations                                     │    │
│  │  - Data Processing                                          │    │
│  └────────────────────────┬───────────────────────────────────┘    │
│                            │                                         │
│                            ▼                                         │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    MODELS                                   │    │
│  │  - Database Queries (Knex.js)                               │    │
│  │  - CRUD Operations                                          │    │
│  └────────────────────────┬───────────────────────────────────┘    │
└────────────────────────────┼────────────────────────────────────────┘
                             │ SQL Query
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                             │
│                                                                      │
│  Tables:                                                             │
│  - NGUOIDUNG, NHOMNGUOIDUNG, PHANQUYEN                              │
│  - MONAN, LOAIMONAN                                                 │
│  - THUCDON, THUCDON_MAU, CHITIET_THUCDONMAU                         │
│  - DATTIEC, DATTIEC_DICHVU                                          │
│  - HOADON                                                           │
│  - BAOCAODOANHSO, CHITIET_BAOCAODOANHSO                             │
│  - SANH, LOAISANH, CA, DICHVU, THAMSO                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Các file quan trọng trong workflow

#### Frontend
```
frontend/src/
├── pages/
│   ├── login.jsx              - Đăng nhập
│   ├── MenuManagement.jsx     - Quản lý món ăn & thực đơn mẫu
│   ├── ManagerBooking.jsx     - Đặt tiệc
│   ├── InvoiceManagement.jsx  - Quản lý hóa đơn
│   └── Stats.jsx              - Thống kê doanh thu
├── services/
│   ├── api.js                 - API calls với auto token refresh
│   └── permissionService.js   - Permission checking
└── utils/
    ├── auth.js                - Auth helpers
    └── permissions.js         - Permission constants
```

#### Backend
```
backend/src/
├── routes/
│   ├── nguoidung.routes.js   - Auth routes
│   ├── monan.routes.js       - Dish routes
│   ├── thucdonmau.routes.js  - Template menu routes
│   ├── dattiec.routes.js     - Booking routes
│   ├── hoadon.routes.js      - Invoice routes
│   └── baocaodoanhso.routes.js - Report routes
├── controller/
│   ├── nguoidung.controller.js
│   ├── monan.controller.js
│   ├── dattiec.controller.js
│   ├── hoadon.controller.js
│   └── baocaodoanhso.controller.js
├── services/
│   ├── auth.services.js
│   ├── monan.services.js
│   ├── dattiec.services.js
│   ├── hoadon.services.js
│   └── baocaodoanhso.services.js
├── models/
│   ├── nguoidung.model.js
│   ├── monan.model.js
│   ├── thucdonmau.model.js
│   ├── dattiec.model.js
│   ├── hoadon.model.js
│   └── baocaodoanhso.model.js
└── middleware/
    ├── auth.middleware.js
    ├── authorization.middleware.js
    ├── ratelimit.middleware.js
    └── validations/
        ├── validateMonAn.js
        ├── validateDatTiec.js
        └── validateHoaDon.js
```

### Security Features

1. **JWT Authentication**: Access token (1h) + Refresh token
2. **Auto Token Refresh**: Transparent token renewal
3. **RBAC**: Role-Based Access Control với 6 roles
4. **Rate Limiting**: Prevent DDoS/brute-force
5. **Input Validation**: Joi schemas
6. **SQL Injection Prevention**: Parameterized queries (Knex)
7. **Audit Logging**: Track all critical actions

### Key Technical Decisions

1. **Frontend**: React 18 + Vite + React Router
2. **Backend**: Node.js + Express
3. **Database**: PostgreSQL
4. **ORM**: Knex.js
5. **Auth**: JWT + UUID refresh tokens
6. **Validation**: Joi
7. **Security**: bcrypt, rate-limiting

---

**Document Version:** 1.0  
**Date:** December 28, 2025  
**Author:** System Analysis
