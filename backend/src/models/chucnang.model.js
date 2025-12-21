import db from '../../database/connection.js';

const ChucNang = {
  // Lấy tất cả chức năng
  async getAll() {
    return db('CHUCNANG')
      .select('*')
      .orderBy('TenChucNang');
  },

  // Lấy chức năng theo ID
  async findById(id) {
    return db('CHUCNANG')
      .where({ MaChucNang: id })
      .first();
  },

  // Tìm chức năng theo tên
  async findByTen(tenChucNang) {
    return db('CHUCNANG')
      .where({ TenChucNang: tenChucNang })
      .first();
  },

  // Tạo chức năng mới
  async create(data) {
    const [chucNang] = await db('CHUCNANG').insert(data).returning('*');
    return chucNang;
  },

  // Cập nhật chức năng
  async update(id, data) {
    const [chucNang] = await db('CHUCNANG')
      .where({ MaChucNang: id })
      .update(data)
      .returning('*');
    return chucNang;
  },

  // Xóa chức năng
  async remove(id) {
    // Xóa phân quyền liên quan trước
    await db('PHANQUYEN')
      .where({ MaChucNang: id })
      .delete();
    
    // Xóa chức năng
    return db('CHUCNANG')
      .where({ MaChucNang: id })
      .delete();
  }
};

export default ChucNang;
