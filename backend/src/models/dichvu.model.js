import db from '../../database/connection.js';

const DichVu = {
  // Lấy tất cả dịch vụ
  async getAll() {
    return db('DICHVU')
      .select('DICHVU.*', 'LOAIDICHVU.TenLoaiDichVu')
      .leftJoin('LOAIDICHVU', 'DICHVU.MaLoaiDichVu', 'LOAIDICHVU.MaLoaiDichVu')
      .where('DICHVU.DaXoa', false)
      .orderBy('DICHVU.TenDichVu');
  },

  // Tìm theo ID
  async findById(id) {
    return db('DICHVU')
      .select('DICHVU.*', 'LOAIDICHVU.TenLoaiDichVu')
      .leftJoin('LOAIDICHVU', 'DICHVU.MaLoaiDichVu', 'LOAIDICHVU.MaLoaiDichVu')
      .where({ MaDichVu: id })
      .first();
  },

  // Tìm theo tên
  async findByTenDichVu(tenDichVu) {
    return db('DICHVU').where({ TenDichVu: tenDichVu }).first();
  },

  // Tạo mới
  async create(data) {
    const [dichVu] = await db('DICHVU').insert(data).returning('*');
    return dichVu;
  },

  // Cập nhật
  async update(id, data) {
    const [dichVu] = await db('DICHVU')
      .where({ MaDichVu: id })
      .update(data)
      .returning('*');
    return dichVu;
  },

  // Xóa mềm
  async remove(id) {
    return db('DICHVU')
      .where({ MaDichVu: id })
      .update({ DaXoa: true });
  },
};

export default DichVu;
