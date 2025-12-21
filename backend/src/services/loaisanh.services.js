import { knex } from '../config/database.js';
import LoaiSanh from '../models/LoaiSanh.js';

export const validateLoaiSanhCreation = async (tenLoaiSanh) => {
  const existing = await LoaiSanh.findByTenLoaiSanh(tenLoaiSanh);
  if (existing) {
    throw new Error('Tên loại sảnh đã tồn tại');
  }
};

export const validateLoaiSanhUpdate = async (id, tenLoaiSanh) => {
  if (tenLoaiSanh) {
    const existing = await knex('LOAISANH')
      .where({ TenLoaiSanh: tenLoaiSanh })
      .whereNot({ MaLoaiSanh: id })
      .first();
    if (existing) {
      throw new Error('Tên loại sảnh đã tồn tại');
    }
  }

  const daDuocDatTiec = await LoaiSanh.checkDaDuocDatTiec(id);
  if (daDuocDatTiec) {
    throw new Error('Loại sảnh đã được đặt tiệc, không thể cập nhật');
  }
};

export const validateLoaiSanhDeletion = async (id) => {
  const sanhCount = await knex('SANH')
    .where({ MaLoaiSanh: id })
    .count('MaSanh as count')
    .first();

  if (parseInt(sanhCount.count) > 0) {
    throw new Error('Loại sảnh đang được sử dụng, không thể xóa');
  }
};
