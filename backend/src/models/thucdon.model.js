import db from '../../database/connection.js';

const ThucDon = {
  // Lấy tất cả thực đơn
  async getAll() {
    return db('THUCDON')
      .select('*')
      .where('DaXoa', false)
      .orderBy('TenThucDon');
  },

  // Lấy thực đơn theo ID
  async findById(id) {
    return db('THUCDON')
      .where({ MaThucDon: id })
      .first();
  },

  // Tìm thực đơn theo tên
  async findByTen(tenThucDon) {
    return db('THUCDON')
      .where({ TenThucDon: tenThucDon })
      .first();
  },

  // Tạo thực đơn mới
  async create(data) {
    const [thucDon] = await db('THUCDON').insert(data).returning('*');
    return thucDon;
  },

  // Cập nhật thực đơn
  async update(id, data) {
    const [thucDon] = await db('THUCDON')
      .where({ MaThucDon: id })
      .update(data)
      .returning('*');
    return thucDon;
  },

  // Xóa mềm thực đơn
  async remove(id) {
    return db('THUCDON')
      .where({ MaThucDon: id })
      .update({ DaXoa: true });
  },

  // Lấy danh sách món ăn trong thực đơn
  async getMonAn(maThucDon) {
    return db('THUCDON_MONAN')
      .select(
        'MONAN.*',
        'LOAIMONAN.TenLoaiMonAn',
        'THUCDON_MONAN.DonGiaThoiDiemDat'
      )
      .join('MONAN', 'THUCDON_MONAN.MaMonAn', 'MONAN.MaMonAn')
      .leftJoin('LOAIMONAN', 'MONAN.MaLoaiMonAn', 'LOAIMONAN.MaLoaiMonAn')
      .where('THUCDON_MONAN.MaThucDon', maThucDon);
  },

  // Thêm món ăn vào thực đơn
  async addMonAn(maThucDon, maMonAn, donGiaThoiDiemDat) {
    // Kiểm tra món ăn tồn tại và chưa bị xóa
    const monAn = await db('MONAN')
      .where({ MaMonAn: maMonAn, DaXoa: false })
      .first();
    
    if (!monAn) {
      throw new Error('Mon an khong ton tai hoac da bi xoa');
    }
    
    // Kiểm tra món ăn đã tồn tại trong thực đơn chưa
    const existing = await db('THUCDON_MONAN')
      .where({ MaThucDon: maThucDon, MaMonAn: maMonAn })
      .first();
    
    if (existing) {
      throw new Error('Mon an da ton tai trong thuc don');
    }
    
    const [result] = await db('THUCDON_MONAN')
      .insert({
        MaThucDon: maThucDon,
        MaMonAn: maMonAn,
        DonGiaThoiDiemDat: donGiaThoiDiemDat
      })
      .returning('*');
    return result;
  },

  // Cập nhật đơn giá món ăn trong thực đơn
  async updateMonAn(maThucDon, maMonAn, donGiaThoiDiemDat) {
    const [result] = await db('THUCDON_MONAN')
      .where({ MaThucDon: maThucDon, MaMonAn: maMonAn })
      .update({ DonGiaThoiDiemDat: donGiaThoiDiemDat })
      .returning('*');
    return result;
  },

  // Xóa món ăn khỏi thực đơn
  async removeMonAn(maThucDon, maMonAn) {
    return db('THUCDON_MONAN')
      .where({ MaThucDon: maThucDon, MaMonAn: maMonAn })
      .delete();
  },

  // Xóa tất cả món ăn khỏi thực đơn
  async clearMonAn(maThucDon) {
    return db('THUCDON_MONAN')
      .where({ MaThucDon: maThucDon })
      .delete();
  },

  // Tính tổng đơn giá của thực đơn
  async calculateTongDonGia(maThucDon) {
    const result = await db('THUCDON_MONAN')
      .where({ MaThucDon: maThucDon })
      .sum('DonGiaThoiDiemDat as total')
      .first();
    
    return parseFloat(result.total) || 0;
  },

  // Cập nhật tổng đơn giá của thực đơn
  async updateTongDonGia(maThucDon) {
    const tongDonGia = await this.calculateTongDonGia(maThucDon);
    
    const [thucDon] = await db('THUCDON')
      .where({ MaThucDon: maThucDon })
      .update({ TongDonGiaThoiDiemDat: tongDonGia })
      .returning('*');
    
    return thucDon;
  },

  // Tạo thực đơn từ thực đơn mẫu
  async createFromTemplate(maThucDonMau, tenThucDon, ghiChu) {
    // Lấy thông tin thực đơn mẫu
    const thucDonMau = await db('THUCDON_MAU')
      .where({ MaThucDon: maThucDonMau })
      .first();
    
    if (!thucDonMau || thucDonMau.DaXoa) {
      throw new Error('Thực đơn mẫu không tồn tại');
    }

    // Lấy danh sách món ăn từ thực đơn mẫu
    const monAnList = await db('CHITIET_THUCDONMAU')
      .select('MONAN.MaMonAn', 'MONAN.DonGia')
      .join('MONAN', 'CHITIET_THUCDONMAU.MaMonAn', 'MONAN.MaMonAn')
      .where('CHITIET_THUCDONMAU.MaThucDon', maThucDonMau)
      .where('MONAN.DaXoa', false);

    // Tính tổng đơn giá
    const tongDonGia = monAnList.reduce((sum, item) => sum + parseFloat(item.DonGia), 0);

    // Tạo thực đơn mới
    const [thucDon] = await db('THUCDON')
      .insert({
        TenThucDon: tenThucDon || thucDonMau.TenThucDon,
        TongDonGiaThoiDiemDat: tongDonGia,
        GhiChu: ghiChu || thucDonMau.GhiChu
      })
      .returning('*');

    // Thêm món ăn vào thực đơn
    if (monAnList.length > 0) {
      const chiTietData = monAnList.map(item => ({
        MaThucDon: thucDon.MaThucDon,
        MaMonAn: item.MaMonAn,
        DonGiaThoiDiemDat: item.DonGia
      }));

      await db('THUCDON_MONAN').insert(chiTietData);
    }

    return thucDon;
  },

  // Kiểm tra thực đơn đã được sử dụng trong đặt tiệc chưa
  async isUsedInDatTiec(maThucDon) {
    const result = await db('DATTIEC')
      .where({ MaThucDon: maThucDon })
      .count('MaDatTiec as count')
      .first();
    
    return parseInt(result.count) > 0;
  }
};

export default ThucDon;
