#!/bin/bash

# Script: Xóa users từ MaNguoiDung 1-6
# Usage: ./delete_users_1_to_6.sh

echo "⚠️  WARNING: This will delete users with MaNguoiDung from 1 to 6!"
echo "This action CANNOT be undone!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cancelled."
    exit 0
fi

echo ""
echo "🗑️  Deleting users..."

# Thay đổi connection string phù hợp với database của bạn
DB_CONNECTION="postgresql://postgres:postgres@localhost:5432/everlasting"

psql $DB_CONNECTION <<EOF
-- Xóa refresh tokens
DELETE FROM "REFRESHTOKEN" 
WHERE "MaNguoiDung" BETWEEN 1 AND 6;

-- Xóa users
DELETE FROM "NGUOIDUNG" 
WHERE "MaNguoiDung" BETWEEN 1 AND 6;

-- Verify
SELECT 
  COUNT(*) as deleted_count,
  'Users with ID 1-6 deleted' as status
FROM "NGUOIDUNG" 
WHERE "MaNguoiDung" BETWEEN 1 AND 6;

-- Show remaining users
SELECT 
  "MaNguoiDung",
  "TenDangNhap",
  "TenNguoiDung",
  "MaNhom"
FROM "NGUOIDUNG"
ORDER BY "MaNguoiDung";
EOF

echo ""
echo "✅ Done!"
