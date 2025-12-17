// File này sẽ được thay thế bởi dichvu.model.js
// Đang giữ lại tạm để tránh break code
import db from '../../database/connection.js';

const products = {
  async getAll() {
    return db('DICHVU')
      .select('DICHVU.*', 'LOAIDICHVU.TenLoaiDichVu')
      .leftJoin('LOAIDICHVU', 'DICHVU.MaLoaiDichVu', 'LOAIDICHVU.MaLoaiDichVu')
      .where('DICHVU.DaXoa', false)
      .orderBy('DICHVU.TenDichVu');
  },
};

export default products;
