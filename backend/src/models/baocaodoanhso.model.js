import db from '../../database/connection.js';

const BaoCaoDoanhSo = {
  // Lấy tất cả báo cáo doanh số
  async getAll() {
    return db('BAOCAODOANHSO')
      .select('*')
      .orderBy('Nam', 'desc')
      .orderBy('Thang', 'desc');
  },

  // Lấy báo cáo theo ID
  async findById(id) {
    return db('BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: id })
      .first();
  },

  // Lấy báo cáo theo tháng/năm
  async findByThangNam(thang, nam) {
    return db('BAOCAODOANHSO')
      .where({ Thang: thang, Nam: nam })
      .first();
  },

  // Tạo báo cáo mới
  async create(data) {
    const [baoCao] = await db('BAOCAODOANHSO').insert(data).returning('*');
    return baoCao;
  },

  // Cập nhật báo cáo
  async update(id, data) {
    const [baoCao] = await db('BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: id })
      .update(data)
      .returning('*');
    return baoCao;
  },

  // Xóa báo cáo
  async remove(id) {
    // Xóa chi tiết trước
    await db('CHITIET_BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: id })
      .delete();
    
    // Xóa báo cáo
    return db('BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: id })
      .delete();
  },

  // Lấy chi tiết báo cáo
  async getChiTiet(maBaoCaoDoanhSo) {
    return db('CHITIET_BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: maBaoCaoDoanhSo })
      .orderBy('Ngay', 'asc');
  },

  // Thêm chi tiết báo cáo
  async addChiTiet(data) {
    const [chiTiet] = await db('CHITIET_BAOCAODOANHSO')
      .insert(data)
      .returning('*');
    return chiTiet;
  },

  // Cập nhật chi tiết báo cáo
  async updateChiTiet(maBaoCaoDoanhSo, ngay, data) {
    const [chiTiet] = await db('CHITIET_BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: maBaoCaoDoanhSo, Ngay: ngay })
      .update(data)
      .returning('*');
    return chiTiet;
  },

  // Xóa chi tiết báo cáo
  async removeChiTiet(maBaoCaoDoanhSo, ngay) {
    return db('CHITIET_BAOCAODOANHSO')
      .where({ MaBaoCaoDoanhSo: maBaoCaoDoanhSo, Ngay: ngay })
      .delete();
  },

  // Lấy thống kê theo năm
  async getByNam(nam) {
    return db('BAOCAODOANHSO')
      .where({ Nam: nam })
      .orderBy('Thang', 'asc');
  }
};

export default BaoCaoDoanhSo;
