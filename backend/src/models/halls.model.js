// models/Hall.js
import db from '../../database/connection.js';

const Hall = {
  // Lấy tất cả halls
  async getAll() {
    return db('halls').select('*').orderBy('id');
  },

  // Lấy hall theo id
  async findById(id) {
    return db('halls').where({ id }).first();
  },

  // Tạo hall mới
  async create({ ten_sanh, loai_sanh, so_luong_ban_toi_da, don_gia_ban_toi_thieu, ghi_chu }) {
    const [hall] = await db('halls')
      .insert({
        ten_sanh,
        loai_sanh,
        so_luong_ban_toi_da,
        don_gia_ban_toi_thieu,
        ghi_chu,
      })
      .returning('*');
    return hall;
  },

  // Cập nhật hall theo id
  async update(id, { ten_sanh, loai_sanh, so_luong_ban_toi_da, don_gia_ban_toi_thieu, ghi_chu }) {
    const [hall] = await db('halls')
      .where({ id })
      .update({
        ten_sanh,
        loai_sanh,
        so_luong_ban_toi_da,
        don_gia_ban_toi_thieu,
        ghi_chu,
      })
      .returning('*');
    return hall;
  },

  // Xoá hall theo id
  async remove(id) {
    const [deleted] = await db('halls')
      .where({ id })
      .del()
      .returning('id'); // để trả lại id đã xoá
    return deleted;
  },
};

export default Hall;
