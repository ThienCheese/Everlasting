import db from '../../database/connection.js';

const LoaiMonAn = {
  // Lấy tất cả loại món ăn
  async getAll() {
    return db('LOAIMONAN')
      .select('*')
      .where('DaXoa', false)
      .orderBy('TenLoaiMonAn');
  },

  // Tìm theo ID
  async findById(id) {
    return db('LOAIMONAN').where({ MaLoaiMonAn: id }).first();
  },

  // Tìm theo tên
  async findByTenLoaiMonAn(tenLoaiMonAn) {
    return db('LOAIMONAN').where({ TenLoaiMonAn: tenLoaiMonAn }).first();
  },

  // Kiểm tra đã được sử dụng trong món ăn chưa
  async checkDaSuDung(maLoaiMonAn) {
    const count = await db('MONAN')
      .where({ MaLoaiMonAn: maLoaiMonAn })
      .count('MaMonAn as count')
      .first();
    return parseInt(count.count) > 0;
  },

  // Tạo mới
  async create(data) {
    const [loaiMonAn] = await db('LOAIMONAN').insert(data).returning('*');
    return loaiMonAn;
  },

  // Cập nhật
  async update(id, data) {
    const [loaiMonAn] = await db('LOAIMONAN')
      .where({ MaLoaiMonAn: id })
      .update(data)
      .returning('*');
    return loaiMonAn;
  },

  // Xóa mềm
  async remove(id) {
    return db('LOAIMONAN')
      .where({ MaLoaiMonAn: id })
      .update({ DaXoa: true });
  },
};

export default LoaiMonAn;
