import db from '../../database/connection.js';
import Dish from '../models/dishes.model.js';

export const validateDishCreation = async (tenMonAn, maLoaiMonAn) => {
  // Kiểm tra loại món ăn tồn tại
  const loaiMonAn = await db('LOAIMONAN')
    .where({ MaLoaiMonAn: maLoaiMonAn })
    .first();
  if (!loaiMonAn) {
    throw new Error('Mã loại món ăn không tồn tại');
  }

  // Kiểm tra trùng tên món ăn
  const existing = await Dish.findByTenMonAn(tenMonAn);
  if (existing) {
    throw new Error('Tên món ăn đã tồn tại');
  }
};

export const validateDishUpdate = async (id, tenMonAn, maLoaiMonAn) => {
  // Nếu có maLoaiMonAn mới thì check
  if (maLoaiMonAn) {
    const loaiMonAn = await db('LOAIMONAN')
      .where({ MaLoaiMonAn: maLoaiMonAn })
      .first();
    if (!loaiMonAn) {
      throw new Error('Mã loại món ăn không tồn tại');
    }
  }

  // Nếu có tenMonAn mới thì check trùng (trừ bản ghi hiện tại)
  if (tenMonAn) {
    const existing = await db('MONAN')
      .where({ TenMonAn: tenMonAn })
      .whereNot({ MaMonAn: id })
      .first();
    if (existing) {
      throw new Error('Tên món ăn đã tồn tại');
    }
  }
};

export const validateDishDeletion = async (id) => {
  // Kiểm tra món ăn có trong thực đơn không
  const count = await db('THUCDON_MONAN')
    .where({ MaMonAn: id })
    .count('MaMonAn as count')
    .first();

  if (parseInt(count.count) > 0) {
    throw new Error('Món ăn đang được sử dụng trong thực đơn, không thể xóa');
  }
};
