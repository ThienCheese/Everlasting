import db from '../../database/connection.js';
import LoaiMonAn from '../models/loaimonan.model.js';

export const validateLoaiMonAnCreation = async (tenLoaiMonAn) => {
  const existing = await LoaiMonAn.findByTenLoaiMonAn(tenLoaiMonAn);
  if (existing) {
    throw new Error('Tên loại món ăn đã tồn tại');
  }
};

export const validateLoaiMonAnUpdate = async (id, tenLoaiMonAn) => {
  if (tenLoaiMonAn) {
    const existing = await db('LOAIMONAN')
      .where({ TenLoaiMonAn: tenLoaiMonAn })
      .whereNot({ MaLoaiMonAn: id })
      .first();
    if (existing) {
      throw new Error('Tên loại món ăn đã tồn tại');
    }
  }
};

export const validateLoaiMonAnDeletion = async (id) => {
  // Kiểm tra loại món ăn có trong thực đơn của đặt tiệc chưa thanh toán không
  const count = await db('MONAN')
    .join('THUCDON_MONAN', 'MONAN.MaMonAn', 'THUCDON_MONAN.MaMonAn')
    .join('THUCDON', 'THUCDON_MONAN.MaThucDon', 'THUCDON.MaThucDon')
    .join('DATTIEC', 'THUCDON.MaThucDon', 'DATTIEC.MaThucDon')
    .leftJoin('HOADON', 'DATTIEC.MaDatTiec', 'HOADON.MaDatTiec')
    .where('MONAN.MaLoaiMonAn', id)
    .where('MONAN.DaXoa', false)  // Chỉ check món ăn chưa bị xóa
    .where(function() {
      this.whereNull('HOADON.MaHoaDon')  // Chưa có hóa đơn
          .orWhere('HOADON.TrangThai', '!=', 1);  // Hoặc chưa thanh toán
    })
    .count('MONAN.MaMonAn as count')
    .first();

  if (parseInt(count.count) > 0) {
    throw new Error('Loại món ăn đang được sử dụng trong thực đơn của đặt tiệc chưa thanh toán, không thể xóa. Các đặt tiệc đã thanh toán không ảnh hưởng.');
  }
};
