import db from '../../database/connection.js';
import Ca from '../models/ca.model.js';

export const validateCaCreation = async (tenCa) => {
  const existing = await Ca.findByTenCa(tenCa);
  if (existing) {
    throw new Error('Tên ca đã tồn tại');
  }
};

export const validateCaUpdate = async (id, tenCa) => {
  if (tenCa) {
    const existing = await db('CA')
      .where({ TenCa: tenCa })
      .whereNot({ MaCa: id })
      .first();
    if (existing) {
      throw new Error('Tên ca đã tồn tại');
    }
  }
};

export const validateCaDeletion = async (id) => {
  const daSuDung = await Ca.checkDaSuDung(id);
  if (daSuDung) {
    throw new Error('Ca đang được sử dụng trong đặt tiệc chưa thanh toán, không thể xóa. Các đặt tiệc đã thanh toán không ảnh hưởng.');
  }
};
