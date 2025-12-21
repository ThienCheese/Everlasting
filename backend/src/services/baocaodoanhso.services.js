import db from '../../database/connection.js';
import BaoCaoDoanhSo from '../models/baocaodoanhso.model.js';

export const generateBaoCaoDoanhSo = async (thang, nam) => {
  // Kiểm tra tháng và năm hợp lệ
  if (thang < 1 || thang > 12) {
    throw new Error('Thang khong hop le (1-12)');
  }

  if (nam < 2000 || nam > 2100) {
    throw new Error('Nam khong hop le');
  }

  // Lấy danh sách hóa đơn trong tháng
  const hoaDonList = await db('HOADON')
    .select('HOADON.*', 'DATTIEC.NgayDaiTiec')
    .join('DATTIEC', 'HOADON.MaDatTiec', 'DATTIEC.MaDatTiec')
    .whereRaw('EXTRACT(MONTH FROM "DATTIEC"."NgayDaiTiec") = ?', [thang])
    .whereRaw('EXTRACT(YEAR FROM "DATTIEC"."NgayDaiTiec") = ?', [nam]);

  // Tính tổng doanh thu
  const tongDoanhThu = hoaDonList.reduce((sum, hd) => sum + parseFloat(hd.TongTienHoaDon), 0);

  // Tạo báo cáo
  const baoCao = await BaoCaoDoanhSo.create({
    Thang: thang,
    Nam: nam,
    TongDoanhThu: tongDoanhThu
  });

  // Tính toán chi tiết theo ngày
  const chiTietByDate = {};

  hoaDonList.forEach(hd => {
    const ngay = new Date(hd.NgayDaiTiec).toISOString().split('T')[0];
    
    if (!chiTietByDate[ngay]) {
      chiTietByDate[ngay] = {
        soLuongTiec: 0,
        doanhThu: 0
      };
    }

    chiTietByDate[ngay].soLuongTiec += 1;
    chiTietByDate[ngay].doanhThu += parseFloat(hd.TongTienHoaDon);
  });

  // Thêm chi tiết báo cáo
  for (const [ngay, data] of Object.entries(chiTietByDate)) {
    const tiLe = tongDoanhThu > 0 ? (data.doanhThu / tongDoanhThu) * 100 : 0;

    await BaoCaoDoanhSo.addChiTiet({
      MaBaoCaoDoanhSo: baoCao.MaBaoCaoDoanhSo,
      Ngay: ngay,
      SoLuongTiec: data.soLuongTiec,
      DoanhThu: data.doanhThu,
      TiLe: tiLe
    });
  }

  // Lấy lại báo cáo với chi tiết
  const chiTiet = await BaoCaoDoanhSo.getChiTiet(baoCao.MaBaoCaoDoanhSo);
  baoCao.chiTiet = chiTiet;

  return baoCao;
};
