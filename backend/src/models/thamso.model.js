import db from '../../database/connection.js';

const ThamSo = {
  // Lấy tham số
  async get() {
    return db('THAMSO').first();
  },

  // Cập nhật tham số
  async update(data) {
    const exists = await db('THAMSO').first();
    
    if (exists) {
      const [thamSo] = await db('THAMSO')
        .update(data)
        .returning('*');
      return thamSo;
    } else {
      const [thamSo] = await db('THAMSO')
        .insert(data)
        .returning('*');
      return thamSo;
    }
  },

  // Lấy phần trăm phạt trễ
  async getPhanTramPhatTrenNgay() {
    const thamSo = await this.get();
    return thamSo ? thamSo.PhanTramPhatTrenNgay : 0;
  },

  // Cập nhật phần trăm phạt trễ
  async updatePhanTramPhatTrenNgay(phanTram) {
    return this.update({ PhanTramPhatTrenNgay: phanTram });
  }
};

export default ThamSo;
