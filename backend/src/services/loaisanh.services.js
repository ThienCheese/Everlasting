import db from '../../database/connection.js';
import LoaiSanh from '../models/loaisanh.model.js';

export const validateLoaiSanhCreation = async (tenLoaiSanh) => {
  const existing = await LoaiSanh.findByTenLoaiSanh(tenLoaiSanh);
  if (existing) {
    throw new Error('Tên loại sảnh đã tồn tại');
  }
};

export const validateLoaiSanhUpdate = async (id, tenLoaiSanh) => {
  if (tenLoaiSanh) {
    const existing = await db('LOAISANH')
      .where({ TenLoaiSanh: tenLoaiSanh })
      .whereNot({ MaLoaiSanh: id })
      .first();
    if (existing) {
      throw new Error('Tên loại sảnh đã tồn tại');
    }
  }

  // Kiểm tra loại sảnh có đang được sử dụng trong đặt tiệc chưa thanh toán không
  const datTiecCount = await db('SANH')
    .join('DATTIEC', 'SANH.MaSanh', 'DATTIEC.MaSanh')
    .leftJoin('HOADON', 'DATTIEC.MaDatTiec', 'HOADON.MaDatTiec')
    .where('SANH.MaLoaiSanh', id)
    .where(function() {
      this.whereNull('HOADON.MaHoaDon')  // Chưa có hóa đơn
          .orWhere('HOADON.TrangThai', '!=', 1);  // Hoặc chưa thanh toán
    })
    .count('DATTIEC.MaDatTiec as count')
    .first();

  if (parseInt(datTiecCount.count) > 0) {
    throw new Error('Loại sảnh đang được sử dụng trong đặt tiệc chưa thanh toán, không thể cập nhật. Các đặt tiệc đã thanh toán không ảnh hưởng.');
  }
};

export const validateLoaiSanhDeletion = async (id) => {
  // Kiểm tra còn sảnh nào chưa bị xóa thuộc loại này không
  const sanhCount = await db('SANH')
    .where({ MaLoaiSanh: id, DaXoa: false })
    .count('MaSanh as count')
    .first();

  if (parseInt(sanhCount.count) > 0) {
    throw new Error('Còn ' + sanhCount.count + ' sảnh đang thuộc loại này, không thể xóa. Vui lòng xóa hoặc chuyển các sảnh sang loại khác trước.');
  }

  // Kiểm tra loại sảnh có đang được sử dụng trong đặt tiệc chưa thanh toán không
  const datTiecCount = await db('SANH')
    .join('DATTIEC', 'SANH.MaSanh', 'DATTIEC.MaSanh')
    .leftJoin('HOADON', 'DATTIEC.MaDatTiec', 'HOADON.MaDatTiec')
    .where('SANH.MaLoaiSanh', id)
    .where(function() {
      this.whereNull('HOADON.MaHoaDon')  // Chưa có hóa đơn
          .orWhere('HOADON.TrangThai', '!=', 1);  // Hoặc chưa thanh toán
    })
    .count('DATTIEC.MaDatTiec as count')
    .first();

  if (parseInt(datTiecCount.count) > 0) {
    throw new Error('Loại sảnh đang được sử dụng trong đặt tiệc chưa thanh toán, không thể xóa. Các đặt tiệc đã thanh toán không ảnh hưởng.');
  }
};
