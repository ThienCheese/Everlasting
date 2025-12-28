import db from '../../database/connection.js';
import DichVu from '../models/dichvu.model.js';

export const validateDichVuCreation = async (tenDichVu, maLoaiDichVu) => {
  // Kiểm tra loại dịch vụ tồn tại
  const loaiDichVu = await db('LOAIDICHVU')
    .where({ MaLoaiDichVu: maLoaiDichVu })
    .first();
  if (!loaiDichVu) {
    throw new Error('Mã loại dịch vụ không tồn tại');
  }

  // Kiểm tra trùng tên
  const existing = await DichVu.findByTenDichVu(tenDichVu);
  if (existing) {
    throw new Error('Tên dịch vụ đã tồn tại');
  }
};

export const validateDichVuUpdate = async (id, tenDichVu, maLoaiDichVu) => {
  if (maLoaiDichVu) {
    const loaiDichVu = await db('LOAIDICHVU')
      .where({ MaLoaiDichVu: maLoaiDichVu })
      .first();
    if (!loaiDichVu) {
      throw new Error('Mã loại dịch vụ không tồn tại');
    }
  }

  if (tenDichVu) {
    const existing = await db('DICHVU')
      .where({ TenDichVu: tenDichVu })
      .whereNot({ MaDichVu: id })
      .first();
    if (existing) {
      throw new Error('Tên dịch vụ đã tồn tại');
    }
  }
};

export const validateDichVuDeletion = async (id) => {
  // Kiểm tra dịch vụ có trong đặt tiệc chưa thanh toán không
  const count = await db('DATTIEC_DICHVU')
    .join('DATTIEC', 'DATTIEC_DICHVU.MaDatTiec', 'DATTIEC.MaDatTiec')
    .leftJoin('HOADON', 'DATTIEC.MaDatTiec', 'HOADON.MaDatTiec')
    .where('DATTIEC_DICHVU.MaDichVu', id)
    .where(function() {
      this.whereNull('HOADON.MaHoaDon')  // Chưa có hóa đơn
          .orWhere('HOADON.TrangThai', '!=', 1);  // Hoặc chưa thanh toán
    })
    .count('DATTIEC_DICHVU.MaDichVu as count')
    .first();

  if (parseInt(count.count) > 0) {
    throw new Error('Dịch vụ đang được sử dụng trong đặt tiệc chưa thanh toán, không thể xóa. Các đặt tiệc đã thanh toán không ảnh hưởng.');
  }
};
