
import db from '../../database/connection.js';
import Hall from '../models/halls.model.js';

export const validateHallCreation = async (tenSanh, maLoaiSanh) => {
  // Kiểm tra loại sảnh tồn tại
  const loaiSanh = await db('LOAISANH')
    .where({ MaLoaiSanh: maLoaiSanh })
    .first();
  if (!loaiSanh) {
    throw new Error('Mã loại sảnh không tồn tại');
  }

  // Kiểm tra trùng tên sảnh
  const existing = await Hall.findByTenSanh(tenSanh);
  if (existing) {
    throw new Error('Tên sảnh đã tồn tại');
  }
};

export const validateHallUpdate = async (id, tenSanh, maLoaiSanh) => {
  // Nếu có maLoaiSanh mới thì check
  if (maLoaiSanh) {
    const loaiSanh = await db('LOAISANH')
      .where({ MaLoaiSanh: maLoaiSanh })
      .first();
    if (!loaiSanh) {
      throw new Error('Mã loại sảnh không tồn tại');
    }
  }

  // Nếu có tenSanh mới thì check trùng (trừ bản ghi hiện tại)
  if (tenSanh) {
    const existing = await db('SANH')
      .where({ TenSanh: tenSanh })
      .whereNot({ MaSanh: id })
      .first();
    if (existing) {
      throw new Error('Tên sảnh đã tồn tại');
    }
  }
};

export const validateHallDeletion = async (id) => {
  // Kiểm tra ràng buộc khóa ngoại
  const datTiecCount = await db('DATTIEC')
    .where({ MaSanh: id })
    .count('MaDatTiec as count')
    .first();

  if (parseInt(datTiecCount.count) > 0) {
    throw new Error('Sảnh đang được sử dụng trong đặt tiệc, không thể xóa');
  }
};
