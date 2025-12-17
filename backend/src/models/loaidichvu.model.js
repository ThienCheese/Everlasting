import db from '../../database/connection.js';

const LoaiDichVu = {
  // Lấy tất cả
  async getAll() {
    return db('LOAIDICHVU')
      .select('*')
      .where('DaXoa', false)
      .orderBy('TenLoaiDichVu');
  },

  // Tìm theo ID
  async findById(id) {
    return db('LOAIDICHVU').where({ MaLoaiDichVu: id }).first();
  },

  // Tìm theo tên
  async findByTenLoaiDichVu(tenLoaiDichVu) {
    return db('LOAIDICHVU').where({ TenLoaiDichVu: tenLoaiDichVu }).first();
  },

  // Kiểm tra đã được sử dụng
  async checkDaSuDung(maLoaiDichVu) {
    const count = await db('DICHVU')
      .where({ MaLoaiDichVu: maLoaiDichVu })
      .count('MaDichVu as count')
      .first();
    return parseInt(count.count) > 0;
  },

  // Tạo mới
  async create(data) {
    const [loaiDichVu] = await db('LOAIDICHVU').insert(data).returning('*');
    return loaiDichVu;
  },

  // Cập nhật
  async update(id, data) {
    const [loaiDichVu] = await db('LOAIDICHVU')
      .where({ MaLoaiDichVu: id })
      .update(data)
      .returning('*');
    return loaiDichVu;
  },

  // Xóa mềm
  async remove(id) {
    return db('LOAIDICHVU')
      .where({ MaLoaiDichVu: id })
      .update({ DaXoa: true });
  },
};

export default LoaiDichVu;
