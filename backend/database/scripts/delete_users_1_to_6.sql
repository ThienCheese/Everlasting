-- Script: Xóa users từ MaNguoiDung 1-6
-- Date: 2025-12-21
-- Warning: Thao tác này không thể hoàn tác!

-- Bước 1: Xóa refresh tokens liên quan
DELETE FROM "REFRESHTOKEN" 
WHERE "MaNguoiDung" BETWEEN 1 AND 6;

-- Bước 2: Xóa các references khác nếu có (thêm nếu cần)
-- Ví dụ: xóa logs, activities, etc.

-- Bước 3: Xóa users
DELETE FROM "NGUOIDUNG" 
WHERE "MaNguoiDung" BETWEEN 1 AND 6;

-- Verify: Kiểm tra còn users nào không
SELECT * FROM "NGUOIDUNG" 
WHERE "MaNguoiDung" BETWEEN 1 AND 6;

-- Hiển thị users còn lại
SELECT 
  "MaNguoiDung",
  "TenDangNhap",
  "TenNguoiDung",
  "MaNhom",
  N."TenNhom"
FROM "NGUOIDUNG" U
JOIN "NHOMNGUOIDUNG" N ON U."MaNhom" = N."MaNhom"
ORDER BY "MaNguoiDung";
