import db from '../../database/connection.js';

const ThucDonMau = {
  // Lấy tất cả thực đơn mẫu
  async getAll() {
    return db('THUCDON_MAU')
      .select('*')
      .where('DaXoa', false)
      .orderBy('TenThucDon');
  },

  // Lấy thực đơn mẫu theo ID
  async findById(id) {
    return db('THUCDON_MAU')
      .where({ MaThucDon: id })
      .first();
  },

  // Tạo thực đơn mẫu mới
  async create(data) {
    const [thucDon] = await db('THUCDON_MAU').insert(data).returning('*');
    return thucDon;
  },

  // Cập nhật thực đơn mẫu
  async update(id, data) {
    const [thucDon] = await db('THUCDON_MAU')
      .where({ MaThucDon: id })
      .update(data)
      .returning('*');
    return thucDon;
  },

  // Xóa mềm thực đơn mẫu
  async remove(id) {
    return db('THUCDON_MAU')
      .where({ MaThucDon: id })
      .update({ DaXoa: true });
  },

  // Lấy danh sách món ăn trong thực đơn mẫu
  async getMonAn(maThucDon) {
    return db('CHITIET_THUCDONMAU')
      .select('MONAN.*', 'LOAIMONAN.TenLoaiMonAn')
      .join('MONAN', 'CHITIET_THUCDONMAU.MaMonAn', 'MONAN.MaMonAn')
      .leftJoin('LOAIMONAN', 'MONAN.MaLoaiMonAn', 'LOAIMONAN.MaLoaiMonAn')
      .where('CHITIET_THUCDONMAU.MaThucDon', maThucDon)
      .where('MONAN.DaXoa', false);
  },

  // Thêm món ăn vào thực đơn mẫu
  async addMonAn(maThucDon, maMonAn) {
    const [result] = await db('CHITIET_THUCDONMAU')
      .insert({ MaThucDon: maThucDon, MaMonAn: maMonAn })
      .returning('*');
    return result;
  },

  // Xóa món ăn khỏi thực đơn mẫu
  async removeMonAn(maThucDon, maMonAn) {
    return db('CHITIET_THUCDONMAU')
      .where({ MaThucDon: maThucDon, MaMonAn: maMonAn })
      .delete();
  },

  // Xóa tất cả món ăn khỏi thực đơn mẫu
  async clearMonAn(maThucDon) {
    return db('CHITIET_THUCDONMAU')
      .where({ MaThucDon: maThucDon })
      .delete();
  },

  // Sao chép thực đơn mẫu sang thực đơn thật
  async copyToThucDon(maThucDonMau) {
    const thucDonMau = await this.findById(maThucDonMau);
    if (!thucDonMau) return null;

    const monAnList = await db('CHITIET_THUCDONMAU')
      .select('MONAN.MaMonAn', 'MONAN.DonGia')
      .join('MONAN', 'CHITIET_THUCDONMAU.MaMonAn', 'MONAN.MaMonAn')
      .where('CHITIET_THUCDONMAU.MaThucDon', maThucDonMau)
      .where('MONAN.DaXoa', false);

    const tongDonGia = monAnList.reduce((sum, item) => sum + parseFloat(item.DonGia), 0);

    return {
      TenThucDon: thucDonMau.TenThucDon,
      TongDonGiaThoiDiemDat: tongDonGia,
      GhiChu: thucDonMau.GhiChu,
      monAn: monAnList
    };
  }
};

export default ThucDonMau;
