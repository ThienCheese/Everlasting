import db from '../../database/connection.js';

const HoaDon = {
  // Lấy tất cả hóa đơn
  async getAll() {
    return db('HOADON')
      .select(
        'HOADON.*',
        'DATTIEC.TenChuRe',
        'DATTIEC.TenCoDau',
        'DATTIEC.NgayDaiTiec',
        'SANH.TenSanh'
      )
      .leftJoin('DATTIEC', 'HOADON.MaDatTiec', 'DATTIEC.MaDatTiec')
      .leftJoin('SANH', 'DATTIEC.MaSanh', 'SANH.MaSanh')
      .orderBy('HOADON.NgayLapHoaDon', 'desc');
  },

  // Lấy hóa đơn theo ID
  async findById(id) {
    return db('HOADON')
      .select(
        'HOADON.*',
        'DATTIEC.TenChuRe',
        'DATTIEC.TenCoDau',
        'DATTIEC.DienThoai',
        'DATTIEC.NgayDaiTiec',
        'DATTIEC.SoLuongBan',
        'DATTIEC.TienDatCoc',
        'SANH.TenSanh',
        'CA.TenCa'
      )
      .leftJoin('DATTIEC', 'HOADON.MaDatTiec', 'DATTIEC.MaDatTiec')
      .leftJoin('SANH', 'DATTIEC.MaSanh', 'SANH.MaSanh')
      .leftJoin('CA', 'DATTIEC.MaCa', 'CA.MaCa')
      .where('HOADON.MaHoaDon', id)
      .first();
  },

  // Lấy hóa đơn theo mã đặt tiệc
  async findByMaDatTiec(maDatTiec) {
    return db('HOADON')
      .where({ MaDatTiec: maDatTiec })
      .first();
  },

  // Tạo hóa đơn mới
  async create(data) {
    const [hoaDon] = await db('HOADON').insert(data).returning('*');
    return hoaDon;
  },

  // Cập nhật hóa đơn
  async update(id, data) {
    const [hoaDon] = await db('HOADON')
      .where({ MaHoaDon: id })
      .update(data)
      .returning('*');
    return hoaDon;
  },

  // Xóa hóa đơn
  async remove(id) {
    return db('HOADON')
      .where({ MaHoaDon: id })
      .delete();
  },

  // Lấy hóa đơn theo tháng/năm
  async getByMonth(thang, nam) {
    return db('HOADON')
      .select(
        'HOADON.*',
        'DATTIEC.TenChuRe',
        'DATTIEC.TenCoDau',
        'DATTIEC.NgayDaiTiec'
      )
      .leftJoin('DATTIEC', 'HOADON.MaDatTiec', 'DATTIEC.MaDatTiec')
      .whereRaw('EXTRACT(MONTH FROM "NgayLapHoaDon") = ?', [thang])
      .whereRaw('EXTRACT(YEAR FROM "NgayLapHoaDon") = ?', [nam])
      .orderBy('HOADON.NgayLapHoaDon', 'desc');
  },

  // Lấy hóa đơn theo trạng thái
  async getByTrangThai(trangThai) {
    return db('HOADON')
      .select(
        'HOADON.*',
        'DATTIEC.TenChuRe',
        'DATTIEC.TenCoDau',
        'DATTIEC.NgayDaiTiec',
        'SANH.TenSanh'
      )
      .leftJoin('DATTIEC', 'HOADON.MaDatTiec', 'DATTIEC.MaDatTiec')
      .leftJoin('SANH', 'DATTIEC.MaSanh', 'SANH.MaSanh')
      .where('HOADON.TrangThai', trangThai)
      .orderBy('HOADON.NgayLapHoaDon', 'desc');
  },

  // Cập nhật trạng thái thanh toán
  async updateTrangThai(id, trangThai) {
    const [hoaDon] = await db('HOADON')
      .where({ MaHoaDon: id })
      .update({ TrangThai: trangThai })
      .returning('*');
    return hoaDon;
  }
};

export default HoaDon;
