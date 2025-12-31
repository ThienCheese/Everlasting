import db from '../../database/connection.js';
import LoaiDichVu from '../models/loaidichvu.model.js';

export const validateLoaiDichVuCreation = async (tenLoaiDichVu) => {
  const existing = await LoaiDichVu.findByTenLoaiDichVu(tenLoaiDichVu);
  if (existing) {
    throw new Error('Tên loại dịch vụ đã tồn tại');
  }
};

export const validateLoaiDichVuUpdate = async (id, tenLoaiDichVu) => {
  if (tenLoaiDichVu) {
    const existing = await db('LOAIDICHVU')
      .where({ TenLoaiDichVu: tenLoaiDichVu })
      .whereNot({ MaLoaiDichVu: id })
      .first();
    if (existing) {
      throw new Error('Tên loại dịch vụ đã tồn tại');
    }
  }
};

export const validateLoaiDichVuDeletion = async (id) => {
  // Kiểm tra còn dịch vụ nào chưa bị xóa thuộc loại này không
  const dichVuCount = await db('DICHVU')
    .where({ MaLoaiDichVu: id, DaXoa: false })
    .count('MaDichVu as count')
    .first();

  if (parseInt(dichVuCount.count) > 0) {
    throw new Error('Còn ' + dichVuCount.count + ' dịch vụ đang thuộc loại này, không thể xóa. Vui lòng xóa hoặc chuyển các dịch vụ sang loại khác trước.');
  }

  // Kiểm tra loại dịch vụ có trong đặt tiệc chưa thanh toán không
  const count = await db('DICHVU')
    .join('DATTIEC_DICHVU', 'DICHVU.MaDichVu', 'DATTIEC_DICHVU.MaDichVu')
    .join('DATTIEC', 'DATTIEC_DICHVU.MaDatTiec', 'DATTIEC.MaDatTiec')
    .leftJoin('HOADON', 'DATTIEC.MaDatTiec', 'HOADON.MaDatTiec')
    .where('DICHVU.MaLoaiDichVu', id)
    .where(function() {
      this.whereNull('HOADON.MaHoaDon')  // Chưa có hóa đơn
          .orWhere('HOADON.TrangThai', '!=', 1);  // Hoặc chưa thanh toán
    })
    .count('DICHVU.MaDichVu as count')
    .first();

  if (parseInt(count.count) > 0) {
    throw new Error('Loại dịch vụ đang được sử dụng trong đặt tiệc chưa thanh toán, không thể xóa. Các đặt tiệc đã thanh toán không ảnh hưởng.');
  }
};
