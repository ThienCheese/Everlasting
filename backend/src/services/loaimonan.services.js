import db from '../../database/connection.js';
import LoaiMonAn from '../models/loaimonan.model.js';

export const validateLoaiMonAnCreation = async (tenLoaiMonAn) => {
  const existing = await LoaiMonAn.findByTenLoaiMonAn(tenLoaiMonAn);
  if (existing) {
    throw new Error('Tên loại món ăn đã tồn tại');
  }
};

export const validateLoaiMonAnUpdate = async (id, tenLoaiMonAn) => {
  if (tenLoaiMonAn) {
    const existing = await db('LOAIMONAN')
      .where({ TenLoaiMonAn: tenLoaiMonAn })
      .whereNot({ MaLoaiMonAn: id })
      .first();
    if (existing) {
      throw new Error('Tên loại món ăn đã tồn tại');
    }
  }
};

export const validateLoaiMonAnDeletion = async (id) => {
  const daSuDung = await LoaiMonAn.checkDaSuDung(id);
  if (daSuDung) {
    throw new Error('Loại món ăn đang được sử dụng, không thể xóa');
  }
};
