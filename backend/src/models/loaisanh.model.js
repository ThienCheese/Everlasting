import db from '../../database/connection.js';

const LoaiSanh = {
  create: async (data) => {
    const [loaiSanh] = await db('LOAISANH').insert(data).returning('*');
    return loaiSanh;
  },
  findById: async (id) => {
    return await db('LOAISANH').where({ MaLoaiSanh: id }).first();
  },
  findAll: async () => {
    return await db('LOAISANH').select('*').where('DaXoa', false).orderBy('TenLoaiSanh', 'asc');
  },
  findByTenLoaiSanh: async (tenLoaiSanh) => {
    return await db('LOAISANH').where({ TenLoaiSanh: tenLoaiSanh }).first();
  },
  checkDaDuocDatTiec: async (maLoaiSanh) => {
    const sanh = await db('SANH').where({ MaLoaiSanh: maLoaiSanh }).first();
    if (sanh) {
      return true;
    }
    return false;
  },
  update: async (id, data) => {
    const [loaiSanh] = await db('LOAISANH')
      .where({ MaLoaiSanh: id })
      .update(data)
      .returning('*');
    return loaiSanh;
  },
  delete: async (id) => {
    return await db('LOAISANH').where({ MaLoaiSanh: id }).delete();
  },
  temDelete: async (id) => {
    return await db('LOAISANH')
      .where({ MaLoaiSanh: id })
      .update({ DaXoa: true });
  },
};

export default LoaiSanh;
