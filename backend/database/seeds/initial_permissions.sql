-- ============================================================================
-- SEED INITIAL PERMISSIONS DATA
-- Script này khởi tạo dữ liệu ban đầu cho hệ thống phân quyền
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. SEED NHÓM NGƯỜI DÙNG (ROLES)
-- ============================================================================

INSERT INTO "NHOMNGUOIDUNG" ("MaNhom", "TenNhom") VALUES
  (1, 'Admin'),
  (2, 'Lễ tân'),
  (3, 'Quản lý'),
  (4, 'Bếp trưởng'),
  (5, 'Kế toán'),
  (6, 'Guest')
ON CONFLICT ("MaNhom") DO UPDATE 
SET "TenNhom" = EXCLUDED."TenNhom";

-- ============================================================================
-- 2. SEED CHỨC NĂNG (PERMISSIONS)
-- ============================================================================

INSERT INTO "CHUCNANG" ("MaChucNang", "TenChucNang", "TenManHinh") VALUES
  (1, 'Quản lý người dùng', 'UserScreen'),
  (2, 'Quản lý sảnh', 'HallsScreen'),
  (3, 'Quản lý món ăn', 'FoodScreen'),
  (4, 'Quản lý dịch vụ', 'ServiceScreen'),
  (5, 'Quản lý đặt tiệc', 'BookingScreen')
ON CONFLICT ("MaChucNang") DO UPDATE 
SET "TenChucNang" = EXCLUDED."TenChucNang",
    "TenManHinh" = EXCLUDED."TenManHinh";

-- ============================================================================
-- 3. SEED PHÂN QUYỀN (PERMISSION MATRIX)
-- ============================================================================

-- Xóa phân quyền cũ (để tránh conflict)
DELETE FROM "PHANQUYEN";

-- Admin (MaNhom = 1) - Toàn quyền
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (1, 1), -- Quản lý người dùng
  (1, 2), -- Quản lý sảnh
  (1, 3), -- Quản lý món ăn
  (1, 4), -- Quản lý dịch vụ
  (1, 5); -- Quản lý đặt tiệc

-- Lễ tân (MaNhom = 2)
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (2, 2), -- Quản lý sảnh
  (2, 5); -- Quản lý đặt tiệc

-- Quản lý (MaNhom = 3)
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (3, 2), -- Quản lý sảnh
  (3, 3), -- Quản lý món ăn
  (3, 4); -- Quản lý dịch vụ

-- Bếp trưởng (MaNhom = 4)
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (4, 3), -- Quản lý món ăn
  (4, 5); -- Quản lý đặt tiệc (xem để chuẩn bị)

-- Kế toán (MaNhom = 5)
INSERT INTO "PHANQUYEN" ("MaNhom", "MaChucNang") VALUES
  (5, 5); -- Quản lý đặt tiệc (xem để tính tiền)

-- Guest (MaNhom = 6) - Không có quyền gì
-- Không insert gì vào PHANQUYEN cho Guest

COMMIT;

-- ============================================================================
-- 4. VERIFY DATA
-- ============================================================================

-- Hiển thị kết quả
SELECT '=== NHÓM NGƯỜI DÙNG ===' as "Info";
SELECT * FROM "NHOMNGUOIDUNG" ORDER BY "MaNhom";

SELECT '=== CHỨC NĂNG ===' as "Info";
SELECT * FROM "CHUCNANG" ORDER BY "MaChucNang";

SELECT '=== PHÂN QUYỀN ===' as "Info";
SELECT 
    N."MaNhom",
    N."TenNhom",
    C."MaChucNang",
    C."TenChucNang"
FROM "PHANQUYEN" P
JOIN "NHOMNGUOIDUNG" N ON P."MaNhom" = N."MaNhom"
JOIN "CHUCNANG" C ON P."MaChucNang" = C."MaChucNang"
ORDER BY N."MaNhom", C."MaChucNang";

-- ============================================================================
-- Script completed successfully
-- ============================================================================
