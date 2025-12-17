import db from '../../database/connection.js';

const Ca = {
  // Lấy tất cả ca
  async getAll() {
    return db('CA')
      .select('*')
      .where('DaXoa', false)
      .orderBy('TenCa');
  },

  // Tìm theo ID
  async findById(id) {
    return db('CA').where({ MaCa: id }).first();
  },

  // Tìm theo tên
  async findByTenCa(tenCa) {
    return db('CA').where({ TenCa: tenCa }).first();
  },

  // Kiểm tra ca đã được dùng trong đặt tiệc chưa
  async checkDaSuDung(maCa) {
    const count = await db('DATTIEC')
      .where({ MaCa: maCa })
      .count('MaDatTiec as count')
      .first();
    return parseInt(count.count) > 0;
  },

  // Tạo mới
  async create(data) {
    const [ca] = await db('CA').insert(data).returning('*');
    return ca;
  },

  // Cập nhật
  async update(id, data) {
    const [ca] = await db('CA')
      .where({ MaCa: id })
      .update(data)
      .returning('*');
    return ca;
  },

  // Xóa mềm
  async remove(id) {
    return db('CA')
      .where({ MaCa: id })
      .update({ DaXoa: true });
  },
};

export default Ca;
