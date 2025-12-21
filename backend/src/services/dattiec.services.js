import db from '../../database/connection.js';
import DatTiec from '../models/dattiec.model.js';

export const validateDatTiecCreation = async (data) => {
  const {
    tenChuRe,
    tenCoDau,
    dienThoai,
    ngayDaiTiec,
    maCa,
    maSanh,
    maThucDon,
    tienDatCoc,
    soLuongBan,
    soBanDuTru
  } = data;

  // Kiểm tra các trường bắt buộc
  if (!tenChuRe || !tenCoDau || !dienThoai || !ngayDaiTiec || !maCa || !maSanh || !maThucDon) {
    throw new Error('Thieu thong tin bat buoc');
  }

  // Kiểm tra ca tồn tại
  const ca = await db('CA').where({ MaCa: maCa, DaXoa: false }).first();
  if (!ca) {
    throw new Error('Ca khong ton tai');
  }

  // Kiểm tra sảnh tồn tại
  const sanh = await db('SANH').where({ MaSanh: maSanh, DaXoa: false }).first();
  if (!sanh) {
    throw new Error('Sanh khong ton tai');
  }

  // Kiểm tra thực đơn tồn tại
  const thucDon = await db('THUCDON').where({ MaThucDon: maThucDon, DaXoa: false }).first();
  if (!thucDon) {
    throw new Error('Thuc don khong ton tai');
  }

  // Kiểm tra sảnh còn trống trong ca và ngày đó không
  const isAvailable = await DatTiec.checkSanhAvailable(maSanh, maCa, ngayDaiTiec);
  if (!isAvailable) {
    throw new Error('Sanh da duoc dat trong ca nay');
  }

  // Kiểm tra số lượng bàn
  if (soLuongBan + (soBanDuTru || 0) > sanh.SoLuongBanToiDa) {
    throw new Error(`So luong ban vuot qua gioi han cua sanh (toi da: ${sanh.SoLuongBanToiDa})`);
  }

  // Kiểm tra tiền đặt cọc
  if (tienDatCoc < 0) {
    throw new Error('Tien dat coc khong hop le');
  }
};

export const validateDatTiecUpdate = async (id, updateData) => {
  const {
    ngayDaiTiec,
    maCa,
    maSanh,
    maThucDon,
    soLuongBan,
    soBanDuTru
  } = updateData;

  // Nếu thay đổi ca
  if (maCa) {
    const ca = await db('CA').where({ MaCa: maCa, DaXoa: false }).first();
    if (!ca) {
      throw new Error('Ca khong ton tai');
    }
  }

  // Nếu thay đổi sảnh
  if (maSanh) {
    const sanh = await db('SANH').where({ MaSanh: maSanh, DaXoa: false }).first();
    if (!sanh) {
      throw new Error('Sanh khong ton tai');
    }
  }

  // Nếu thay đổi thực đơn
  if (maThucDon) {
    const thucDon = await db('THUCDON').where({ MaThucDon: maThucDon, DaXoa: false }).first();
    if (!thucDon) {
      throw new Error('Thuc don khong ton tai');
    }
  }

  // Nếu thay đổi ngày, ca hoặc sảnh, kiểm tra còn trống không
  if (ngayDaiTiec || maCa || maSanh) {
    const datTiec = await DatTiec.findById(id);
    const checkNgay = ngayDaiTiec || datTiec.NgayDaiTiec;
    const checkCa = maCa || datTiec.MaCa;
    const checkSanh = maSanh || datTiec.MaSanh;

    const isAvailable = await DatTiec.checkSanhAvailable(checkSanh, checkCa, checkNgay, id);
    if (!isAvailable) {
      throw new Error('Sanh da duoc dat trong ca nay');
    }
  }

  // Kiểm tra số lượng bàn nếu có thay đổi
  if (soLuongBan !== undefined || soBanDuTru !== undefined || maSanh) {
    const datTiec = await DatTiec.findById(id);
    const sanhId = maSanh || datTiec.MaSanh;
    const sanh = await db('SANH').where({ MaSanh: sanhId }).first();
    
    const totalBan = (soLuongBan || datTiec.SoLuongBan) + (soBanDuTru !== undefined ? soBanDuTru : datTiec.SoBanDuTru);
    
    if (totalBan > sanh.SoLuongBanToiDa) {
      throw new Error(`So luong ban vuot qua gioi han cua sanh (toi da: ${sanh.SoLuongBanToiDa})`);
    }
  }
};

export const validateDatTiecCancellation = async (id) => {
  // Kiểm tra xem đã có hóa đơn chưa
  const hoaDon = await db('HOADON').where({ MaDatTiec: id }).first();
  if (hoaDon) {
    throw new Error('Da co hoa don, khong the huy dat tiec');
  }
};
