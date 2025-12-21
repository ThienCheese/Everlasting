import db from '../../database/connection.js';

const DatTiec = {
  // Lấy tất cả đặt tiệc
  async getAll() {
    return db('DATTIEC')
      .select('DATTIEC.*', 'CA.TenCa', 'SANH.TenSanh', 'THUCDON.TenThucDon')
      .leftJoin('CA', 'DATTIEC.MaCa', 'CA.MaCa')
      .leftJoin('SANH', 'DATTIEC.MaSanh', 'SANH.MaSanh')
      .leftJoin('THUCDON', 'DATTIEC.MaThucDon', 'THUCDON.MaThucDon')
      .where('DATTIEC.DaHuy', false)
      .orderBy('DATTIEC.NgayDaiTiec', 'desc');
  },

  // Lấy đặt tiệc theo ID
  async findById(id) {
    return db('DATTIEC')
      .select('DATTIEC.*', 'CA.TenCa', 'SANH.TenSanh', 'THUCDON.TenThucDon')
      .leftJoin('CA', 'DATTIEC.MaCa', 'CA.MaCa')
      .leftJoin('SANH', 'DATTIEC.MaSanh', 'SANH.MaSanh')
      .leftJoin('THUCDON', 'DATTIEC.MaThucDon', 'THUCDON.MaThucDon')
      .where('DATTIEC.MaDatTiec', id)
      .first();
  },

  // Tạo đặt tiệc mới
  async create(data) {
    const [datTiec] = await db('DATTIEC').insert(data).returning('*');
    return datTiec;
  },

  // Cập nhật đặt tiệc
  async update(id, data) {
    const [datTiec] = await db('DATTIEC')
      .where({ MaDatTiec: id })
      .update(data)
      .returning('*');
    return datTiec;
  },

  // Hủy đặt tiệc (soft delete)
  async cancel(id) {
    return db('DATTIEC')
      .where({ MaDatTiec: id })
      .update({ DaHuy: true });
  },

  // Lấy danh sách dịch vụ của đặt tiệc
  async getDichVu(maDatTiec) {
    return db('DATTIEC_DICHVU')
      .select('DATTIEC_DICHVU.*', 'DICHVU.TenDichVu', 'DICHVU.AnhURL')
      .leftJoin('DICHVU', 'DATTIEC_DICHVU.MaDichVu', 'DICHVU.MaDichVu')
      .where('DATTIEC_DICHVU.MaDatTiec', maDatTiec);
  },

  // Thêm dịch vụ vào đặt tiệc
  async addDichVu(maDatTiec, dichVuData) {
    const [result] = await db('DATTIEC_DICHVU')
      .insert({ MaDatTiec: maDatTiec, ...dichVuData })
      .returning('*');
    return result;
  },

  // Cập nhật dịch vụ trong đặt tiệc
  async updateDichVu(maDatTiec, maDichVu, data) {
    const [result] = await db('DATTIEC_DICHVU')
      .where({ MaDatTiec: maDatTiec, MaDichVu: maDichVu })
      .update(data)
      .returning('*');
    return result;
  },

  // Xóa dịch vụ khỏi đặt tiệc
  async removeDichVu(maDatTiec, maDichVu) {
    return db('DATTIEC_DICHVU')
      .where({ MaDatTiec: maDatTiec, MaDichVu: maDichVu })
      .delete();
  },

  // Kiểm tra sảnh có trống trong ca và ngày cụ thể không
  async checkSanhAvailable(maSanh, maCa, ngayDaiTiec, excludeMaDatTiec = null) {
    const query = db('DATTIEC')
      .where({
        MaSanh: maSanh,
        MaCa: maCa,
        NgayDaiTiec: ngayDaiTiec,
        DaHuy: false
      });
    
    if (excludeMaDatTiec) {
      query.whereNot({ MaDatTiec: excludeMaDatTiec });
    }

    const result = await query.first();
    return !result; // true nếu trống, false nếu đã đặt
  },

  // Lấy đặt tiệc theo ngày
  async getByDate(ngayDaiTiec) {
    return db('DATTIEC')
      .select('DATTIEC.*', 'CA.TenCa', 'SANH.TenSanh', 'THUCDON.TenThucDon')
      .leftJoin('CA', 'DATTIEC.MaCa', 'CA.MaCa')
      .leftJoin('SANH', 'DATTIEC.MaSanh', 'SANH.MaSanh')
      .leftJoin('THUCDON', 'DATTIEC.MaThucDon', 'THUCDON.MaThucDon')
      .where('DATTIEC.NgayDaiTiec', ngayDaiTiec)
      .where('DATTIEC.DaHuy', false)
      .orderBy('CA.TenCa');
  },

  // Lấy đặt tiệc theo tháng/năm
  async getByMonth(thang, nam) {
    return db('DATTIEC')
      .select('DATTIEC.*', 'CA.TenCa', 'SANH.TenSanh', 'THUCDON.TenThucDon')
      .leftJoin('CA', 'DATTIEC.MaCa', 'CA.MaCa')
      .leftJoin('SANH', 'DATTIEC.MaSanh', 'SANH.MaSanh')
      .leftJoin('THUCDON', 'DATTIEC.MaThucDon', 'THUCDON.MaThucDon')
      .whereRaw('EXTRACT(MONTH FROM "NgayDaiTiec") = ?', [thang])
      .whereRaw('EXTRACT(YEAR FROM "NgayDaiTiec") = ?', [nam])
      .where('DATTIEC.DaHuy', false)
      .orderBy('DATTIEC.NgayDaiTiec');
  }
};

export default DatTiec;
