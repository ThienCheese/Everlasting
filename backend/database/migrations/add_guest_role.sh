#!/bin/bash

# Script để thêm nhóm Guest vào database
# Usage: ./add_guest_role.sh

echo "🔧 Adding Guest role to database..."

# Thay đổi connection string phù hợp với database của bạn
DB_CONNECTION="postgresql://postgres.lmisyrpfdngxdhprmcyc:Quoc1234567890@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

psql $DB_CONNECTION <<EOF
-- Thêm nhóm Guest
INSERT INTO "NHOMNGUOIDUNG" ("MaNhom", "TenNhom") 
VALUES (6, 'Guest')
ON CONFLICT ("MaNhom") DO NOTHING;

-- Verify
SELECT * FROM "NHOMNGUOIDUNG" ORDER BY "MaNhom";

-- Hiển thị thống kê
SELECT 
  N."TenNhom",
  COUNT(U."MaNguoiDung") as "SoLuong"
FROM "NHOMNGUOIDUNG" N
LEFT JOIN "NGUOIDUNG" U ON N."MaNhom" = U."MaNhom"
GROUP BY N."MaNhom", N."TenNhom"
ORDER BY N."MaNhom";
EOF

echo "✅ Done! Guest role has been added."
echo "ℹ️  New users will automatically get Guest role (MaNhom = 6)"
