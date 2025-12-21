import db from '../../database/connection.js';

const RefreshToken = {
  // Tạo refresh token mới
  async create(data) {
    const [token] = await db('REFRESH_TOKEN').insert(data).returning('*');
    return token;
  },

  // Tìm refresh token
  async findByToken(refreshToken) {
    return db('REFRESH_TOKEN')
      .where({ RefreshToken: refreshToken })
      .where('HanSuDung', '>', new Date())
      .first();
  },

  // Xóa refresh token
  async remove(refreshToken) {
    return db('REFRESH_TOKEN').where({ RefreshToken: refreshToken }).delete();
  },

  // Xóa tất cả refresh token của user
  async removeAllByUser(maNguoiDung) {
    return db('REFRESH_TOKEN').where({ MaNguoiDung: maNguoiDung }).delete();
  },

  // Xóa các token hết hạn
  async removeExpired() {
    return db('REFRESH_TOKEN').where('HanSuDung', '<', new Date()).delete();
  },
};

export default RefreshToken;
