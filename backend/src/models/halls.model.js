// models/Hall.js
import db from '../../database/connection.js';

const Hall = {
  // Lấy tất cả halls
  async getAll() {
    return await db('SANH')
      .select('SANH.*', 'LOAISANH.TenLoaiSanh', 'LOAISANH.DonGiaBanToiThieu')
      .leftJoin('LOAISANH', 'SANH.MaLoaiSanh', 'LOAISANH.MaLoaiSanh')
      .orderBy([
        { column: 'LOAISANH.TenLoaiSanh', order: 'asc' },
        { column: 'SANH.TenSanh', order: 'asc' },
      ]);
  },

  // Lấy hall theo id
  async findById(id) {
    return await db('SANH')
      .select('SANH.*', 'LOAISANH.TenLoaiSanh', 'LOAISANH.DonGiaBanToiThieu')
      .leftJoin('LOAISANH', 'SANH.MaLoaiSanh', 'LOAISANH.MaLoaiSanh')
      .where({ MaSanh: id })
      .first();
  },

  // Tạo hall mới
   create: async (data) => {
    const [sanh] = await db('SANH').insert(data).returning('*');
    return sanh;
  },

  // Cập nhật hall theo id
  update: async (id, data) => {
    const [sanh] = await db('SANH')
      .where({ MaSanh: id })
      .update(data)
      .returning('*');
    return sanh;
  },
  // Xoá hall theo id
  async remove(id) {
    return await db('SANH').where({ MaSanh: id }).delete();
  },
};

export default Hall;
