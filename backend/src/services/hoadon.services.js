import db from '../../database/connection.js';
import DatTiec from '../models/dattiec.model.js';
import ThucDon from '../models/thucdon.model.js';
import ThamSo from '../models/thamso.model.js';

export const validateHoaDonCreation = async (maDatTiec) => {
  // Kiểm tra đặt tiệc tồn tại
  const datTiec = await DatTiec.findById(maDatTiec);
  if (!datTiec) {
    throw new Error('Dat tiec khong ton tai');
  }

  // Kiểm tra đặt tiệc đã bị hủy chưa
  if (datTiec.DaHuy) {
    throw new Error('Dat tiec da bi huy');
  }

  // Kiểm tra đã có hóa đơn chưa
  const existing = await db('HOADON').where({ MaDatTiec: maDatTiec }).first();
  if (existing) {
    throw new Error('Dat tiec da co hoa don');
  }
};

export const validateHoaDonUpdate = async (id, updateData) => {
  // Có thể thêm các validation khác nếu cần
  return true;
};

export const calculateHoaDon = async (maDatTiec, ngayThanhToan, apDungQuyDinhPhat = false) => {
  // Lấy thông tin đặt tiệc
  const datTiec = await DatTiec.findById(maDatTiec);
  if (!datTiec) {
    throw new Error('Dat tiec khong ton tai');
  }

  // Lấy thực đơn
  const thucDon = await ThucDon.findById(datTiec.MaThucDon);
  if (!thucDon) {
    throw new Error('Thuc don khong ton tai');
  }

  // Tính tiền bàn: Tổng đơn giá thực đơn * (Số lượng bàn + Số bàn dự trữ)
  const tongTienBan = parseFloat(thucDon.TongDonGiaThoiDiemDat) * (datTiec.SoLuongBan + datTiec.SoBanDuTru);

  // Tính tiền dịch vụ
  const dichVuList = await DatTiec.getDichVu(maDatTiec);
  const tongTienDichVu = dichVuList.reduce((sum, dv) => sum + parseFloat(dv.ThanhTien), 0);

  // Tính tổng tiền hóa đơn
  let tongTienHoaDon = tongTienBan + tongTienDichVu;

  // Tính phạt (nếu áp dụng quy định phạt)
  let tongTienPhat = 0;
  let phanTramPhatMotNgay = 0;

  if (apDungQuyDinhPhat) {
    // Lấy tham số phạt
    const thamSo = await ThamSo.get();
    if (thamSo) {
      phanTramPhatMotNgay = parseFloat(thamSo.PhanTramPhatTrenNgay);
    }

    // Tính số ngày trễ
    const ngayDaiTiec = new Date(datTiec.NgayDaiTiec);
    const ngayTT = new Date(ngayThanhToan);
    
    if (ngayTT > ngayDaiTiec) {
      const soNgayTre = Math.floor((ngayTT - ngayDaiTiec) / (1000 * 60 * 60 * 24));
      
      // Công thức phạt: Tổng tiền hóa đơn * Phần trăm phạt 1 ngày * Số ngày trễ
      tongTienPhat = tongTienHoaDon * (phanTramPhatMotNgay / 100) * soNgayTre;
    }
  }

  // Tính tổng tiền còn lại (Tổng hóa đơn + Tiền phạt - Tiền đặt cọc)
  const tongTienConLai = tongTienHoaDon + tongTienPhat - parseFloat(datTiec.TienDatCoc);

  return {
    TongTienBan: tongTienBan,
    TongTienDichVu: tongTienDichVu,
    TongTienHoaDon: tongTienHoaDon,
    ApDungQuyDinhPhat: apDungQuyDinhPhat,
    PhanTramPhatMotNgay: phanTramPhatMotNgay,
    TongTienPhat: tongTienPhat,
    TongTienConLai: tongTienConLai,
    TrangThai: 0 // 0: Chưa thanh toán, 1: Đã thanh toán
  };
};
