import db from '../../database/connection.js';

const Dish = {
  // Lấy tất cả món ăn
  async getAll() {
    return db('MONAN')
      .select('MONAN.*', 'LOAIMONAN.TenLoaiMonAn')
      .leftJoin('LOAIMONAN', 'MONAN.MaLoaiMonAn', 'LOAIMONAN.MaLoaiMonAn')
      .where('MONAN.DaXoa', false)
      .orderBy('MONAN.TenMonAn');
  },

  // Tìm món ăn theo ID
  async findById(id) {
    return db('MONAN')
      .select('MONAN.*', 'LOAIMONAN.TenLoaiMonAn')
      .leftJoin('LOAIMONAN', 'MONAN.MaLoaiMonAn', 'LOAIMONAN.MaLoaiMonAn')
      .where({ MaMonAn: id })
      .first();
  },

  // Tìm món ăn theo tên
  async findByTenMonAn(tenMonAn) {
    return db('MONAN').where({ TenMonAn: tenMonAn }).first();
  },

  // Tạo mới món ăn
  async create(dishData) {
    const [dish] = await db('MONAN').insert(dishData).returning('*');
    return dish;
  },

  // Cập nhật món ăn
  async update(id, updatedData) {
    const [dish] = await db('MONAN')
      .where({ MaMonAn: id })
      .update(updatedData)
      .returning('*');
    return dish;
  },

  // Xoá mềm món ăn
  async remove(id) {
    return db('MONAN')
      .where({ MaMonAn: id })
      .update({ DaXoa: true });
  },
};  

export default Dish;
