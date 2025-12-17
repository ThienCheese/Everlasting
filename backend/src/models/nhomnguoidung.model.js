import db from '../../database/connection.js';

const NhomNguoiDung = {
  // Lấy tất cả nhóm
  async getAll() {
    return db('NHOMNGUOIDUNG').select('*').orderBy('TenNhom');
  },

  // Tìm theo ID
  async findById(id) {
    return db('NHOMNGUOIDUNG').where({ MaNhom: id }).first();
  },

  // Tìm theo tên
  async findByTenNhom(tenNhom) {
    return db('NHOMNGUOIDUNG').where({ TenNhom: tenNhom }).first();
  },

  // Tạo mới
  async create(data) {
    const [nhom] = await db('NHOMNGUOIDUNG').insert(data).returning('*');
    return nhom;
  },

  // Cập nhật
  async update(id, data) {
    const [nhom] = await db('NHOMNGUOIDUNG')
      .where({ MaNhom: id })
      .update(data)
      .returning('*');
    return nhom;
  },

  // Xóa
  async remove(id) {
    return db('NHOMNGUOIDUNG').where({ MaNhom: id }).delete();
  },

  // Lấy quyền của nhóm
  async getPermissions(maNhom) {
    return db('PHANQUYEN')
      .select('CHUCNANG.*')
      .join('CHUCNANG', 'PHANQUYEN.MaChucNang', 'CHUCNANG.MaChucNang')
      .where({ 'PHANQUYEN.MaNhom': maNhom });
  },

  // Gán quyền cho nhóm
  async assignPermission(maNhom, maChucNang) {
    await db('PHANQUYEN').insert({ MaNhom: maNhom, MaChucNang: maChucNang });
  },

  // Xóa quyền của nhóm
  async removePermission(maNhom, maChucNang) {
    return db('PHANQUYEN')
      .where({ MaNhom: maNhom, MaChucNang: maChucNang })
      .delete();
  },
};

export default NhomNguoiDung;
