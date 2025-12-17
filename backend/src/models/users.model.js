import db from '../../database/connection.js';

const User = {
  // Tìm theo email (TenDangNhap)
  async findByEmail(email) {
    return db('NGUOIDUNG').where({ TenDangNhap: email }).first();
  },

  // Tìm theo ID
  async findById(id) {
    return db('NGUOIDUNG')
      .select('NGUOIDUNG.*', 'NHOMNGUOIDUNG.TenNhom')
      .leftJoin('NHOMNGUOIDUNG', 'NGUOIDUNG.MaNhom', 'NHOMNGUOIDUNG.MaNhom')
      .where({ MaNguoiDung: id })
      .first();
  },

  // Tìm theo username
  async findByUsername(username) {
    return db('NGUOIDUNG').where({ TenDangNhap: username }).first();
  },

  // Lấy tất cả users
  async getAll() {
    return db('NGUOIDUNG')
      .select('NGUOIDUNG.*', 'NHOMNGUOIDUNG.TenNhom')
      .leftJoin('NHOMNGUOIDUNG', 'NGUOIDUNG.MaNhom', 'NHOMNGUOIDUNG.MaNhom')
      .orderBy('NGUOIDUNG.TenNguoiDung');
  },

  // Tạo user mới
  async create(data) {
    const [user] = await db('NGUOIDUNG').insert(data).returning('*');
    return user;
  },

  // Cập nhật user
  async update(id, data) {
    const [user] = await db('NGUOIDUNG')
      .where({ MaNguoiDung: id })
      .update(data)
      .returning('*');
    return user;
  },

  // Xóa user
  async remove(id) {
    return db('NGUOIDUNG').where({ MaNguoiDung: id }).delete();
  },

  // Lấy quyền của user
  async getPermissions(maNguoiDung) {
    const user = await db('NGUOIDUNG').where({ MaNguoiDung: maNguoiDung }).first();
    if (!user) return [];

    return db('PHANQUYEN')
      .select('CHUCNANG.*')
      .join('CHUCNANG', 'PHANQUYEN.MaChucNang', 'CHUCNANG.MaChucNang')
      .where({ 'PHANQUYEN.MaNhom': user.MaNhom });
  },
};

export default User;