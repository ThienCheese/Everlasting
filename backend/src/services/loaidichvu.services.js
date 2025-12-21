import db from '../../database/connection.js';
import LoaiDichVu from '../models/loaidichvu.model.js';

export const validateLoaiDichVuCreation = async (tenLoaiDichVu) => {
  const existing = await LoaiDichVu.findByTenLoaiDichVu(tenLoaiDichVu);
  if (existing) {
    throw new Error('Tên loại dịch vụ đã tồn tại');
  }
};

export const validateLoaiDichVuUpdate = async (id, tenLoaiDichVu) => {
  if (tenLoaiDichVu) {
    const existing = await db('LOAIDICHVU')
      .where({ TenLoaiDichVu: tenLoaiDichVu })
      .whereNot({ MaLoaiDichVu: id })
      .first();
    if (existing) {
      throw new Error('Tên loại dịch vụ đã tồn tại');
    }
  }
};

export const validateLoaiDichVuDeletion = async (id) => {
  const daSuDung = await LoaiDichVu.checkDaSuDung(id);
  if (daSuDung) {
    throw new Error('Loại dịch vụ đang được sử dụng, không thể xóa');
  }
};
