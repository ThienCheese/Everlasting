-- Migration: Add Guest role
-- Date: 2025-12-21
-- Description: Thêm nhóm Guest cho user mới đăng ký

-- Thêm nhóm Guest vào bảng NHOMNGUOIDUNG
INSERT INTO "NHOMNGUOIDUNG" ("MaNhom", "TenNhom") 
VALUES (6, 'Guest')
ON CONFLICT ("MaNhom") DO NOTHING;

-- Guest không có quyền nào trong PHANQUYEN
-- Chỉ có thể truy cập các public endpoints (không cần authentication)

-- Note: User mới đăng ký sẽ có MaNhom = 6 (Guest)
-- Admin cần cập nhật MaNhom cho user để cấp quyền:
-- UPDATE "NGUOIDUNG" SET "MaNhom" = 2 WHERE "MaNguoiDung" = ?; -- Lễ tân
-- UPDATE "NGUOIDUNG" SET "MaNhom" = 3 WHERE "MaNguoiDung" = ?; -- Quản lý
-- UPDATE "NGUOIDUNG" SET "MaNhom" = 4 WHERE "MaNguoiDung" = ?; -- Bếp trưởng
-- UPDATE "NGUOIDUNG" SET "MaNhom" = 5 WHERE "MaNguoiDung" = ?; -- Kế toán
