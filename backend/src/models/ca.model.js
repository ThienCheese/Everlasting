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
  // Chỉ check đặt tiệc CHƯA có hóa đơn hoặc hóa đơn chưa thanh toán
  // Nếu đã có hóa đơn thanh toán (TrangThai = 1) thì cho phép xóa mềm
  async checkDaSuDung(maCa) {
    const count = await db('DATTIEC')
      .leftJoin('HOADON', 'DATTIEC.MaDatTiec', 'HOADON.MaDatTiec')
      .where('DATTIEC.MaCa', maCa)
      .where(function() {
        this.whereNull('HOADON.MaHoaDon')  // Chưa có hóa đơn
            .orWhere('HOADON.TrangThai', '!=', 1);  // Hoặc chưa thanh toán
      })
      .count('DATTIEC.MaDatTiec as count')
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
