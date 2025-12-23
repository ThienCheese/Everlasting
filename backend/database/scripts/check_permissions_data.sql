-- Query để xem dữ liệu hiện tại trong database
-- Chạy script này để kiểm tra các constants

-- 1. Xem tất cả NHÓM NGƯỜI DÙNG
SELECT * FROM "NHOMNGUOIDUNG" ORDER BY "MaNhom";

-- 2. Xem tất cả CHỨC NĂNG
SELECT * FROM "CHUCNANG" ORDER BY "MaChucNang";

-- 3. Xem ma trận PHÂN QUYỀN
SELECT 
    N."MaNhom",
    N."TenNhom",
    C."MaChucNang",
    C."TenChucNang",
    CASE WHEN P."MaNhom" IS NOT NULL THEN '✅' ELSE '❌' END as "CoQuyen"
FROM "NHOMNGUOIDUNG" N
CROSS JOIN "CHUCNANG" C
LEFT JOIN "PHANQUYEN" P ON N."MaNhom" = P."MaNhom" AND C."MaChucNang" = P."MaChucNang"
ORDER BY N."MaNhom", C."MaChucNang";

-- 4. Xem phân quyền theo từng nhóm
SELECT 
    N."MaNhom",
    N."TenNhom",
    STRING_AGG(C."TenChucNang", ', ' ORDER BY C."MaChucNang") as "DanhSachQuyen"
FROM "NHOMNGUOIDUNG" N
LEFT JOIN "PHANQUYEN" P ON N."MaNhom" = P."MaNhom"
LEFT JOIN "CHUCNANG" C ON P."MaChucNang" = C."MaChucNang"
GROUP BY N."MaNhom", N."TenNhom"
ORDER BY N."MaNhom";
