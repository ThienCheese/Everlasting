import DatTiec from '../models/dattiec.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  validateDatTiecCreation,
  validateDatTiecUpdate,
  validateDatTiecCancellation
} from '../services/dattiec.services.js';

export const getAllDatTiec = async (req, res) => {
  try {
    const datTiecList = await DatTiec.getAll();
    return successResponse(res, datTiecList, 'Lay danh sach dat tiec thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getDatTiec = async (req, res) => {
  try {
    const datTiec = await DatTiec.findById(req.params.id);
    if (!datTiec) {
      return errorResponse(res, 'Dat tiec khong ton tai', 404);
    }
    return successResponse(res, datTiec, 'Lay thong tin dat tiec thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createDatTiec = async (req, res) => {
  try {
    const {
      tenChuRe,
      tenCoDau,
      dienThoai,
      ngayDatTiec,
      ngayDaiTiec,
      maCa,
      maSanh,
      maThucDon,
      tienDatCoc,
      soLuongBan,
      soBanDuTru
    } = req.body;

    // Validate
    await validateDatTiecCreation({
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
    });

    const datTiec = await DatTiec.create({
      TenChuRe: tenChuRe,
      TenCoDau: tenCoDau,
      DienThoai: dienThoai,
      NgayDatTiec: ngayDatTiec || new Date(),
      NgayDaiTiec: ngayDaiTiec,
      MaCa: maCa,
      MaSanh: maSanh,
      MaThucDon: maThucDon,
      TienDatCoc: tienDatCoc,
      SoLuongBan: soLuongBan,
      SoBanDuTru: soBanDuTru || 0
    });

    return successResponse(res, datTiec, 'Tao dat tiec thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateDatTiec = async (req, res) => {
  try {
    const id = req.params.id;
    const datTiec = await DatTiec.findById(id);
    
    if (!datTiec) {
      return errorResponse(res, 'Dat tiec khong ton tai', 404);
    }

    if (datTiec.DaHuy) {
      return errorResponse(res, 'Khong the cap nhat dat tiec da huy', 400);
    }

    const updateData = req.body;

    // Validate
    await validateDatTiecUpdate(id, updateData);

    const updated = await DatTiec.update(id, {
      TenChuRe: updateData.tenChuRe || datTiec.TenChuRe,
      TenCoDau: updateData.tenCoDau || datTiec.TenCoDau,
      DienThoai: updateData.dienThoai || datTiec.DienThoai,
      NgayDaiTiec: updateData.ngayDaiTiec || datTiec.NgayDaiTiec,
      MaCa: updateData.maCa || datTiec.MaCa,
      MaSanh: updateData.maSanh || datTiec.MaSanh,
      MaThucDon: updateData.maThucDon || datTiec.MaThucDon,
      TienDatCoc: updateData.tienDatCoc !== undefined ? updateData.tienDatCoc : datTiec.TienDatCoc,
      SoLuongBan: updateData.soLuongBan !== undefined ? updateData.soLuongBan : datTiec.SoLuongBan,
      SoBanDuTru: updateData.soBanDuTru !== undefined ? updateData.soBanDuTru : datTiec.SoBanDuTru
    });

    return successResponse(res, updated, 'Cap nhat dat tiec thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const cancelDatTiec = async (req, res) => {
  try {
    const id = req.params.id;
    
    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return errorResponse(res, 'Dat tiec khong ton tai', 404);
    }

    if (datTiec.DaHuy) {
      return errorResponse(res, 'Dat tiec da duoc huy truoc do', 400);
    }

    // Validate
    await validateDatTiecCancellation(id);

    await DatTiec.cancel(id);

    return successResponse(res, { id }, 'Huy dat tiec thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Quản lý dịch vụ trong đặt tiệc
export const getDichVuDatTiec = async (req, res) => {
  try {
    const dichVuList = await DatTiec.getDichVu(req.params.id);
    return successResponse(res, dichVuList, 'Lay danh sach dich vu thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const addDichVuDatTiec = async (req, res) => {
  try {
    const { id } = req.params;
    const { maDichVu, soLuong, donGiaThoiDiemDat } = req.body;

    const datTiec = await DatTiec.findById(id);
    if (!datTiec) {
      return errorResponse(res, 'Dat tiec khong ton tai', 404);
    }

    const thanhTien = soLuong * donGiaThoiDiemDat;

    const dichVu = await DatTiec.addDichVu(id, {
      MaDichVu: maDichVu,
      SoLuong: soLuong,
      DonGiaThoiDiemDat: donGiaThoiDiemDat,
      ThanhTien: thanhTien
    });

    return successResponse(res, dichVu, 'Them dich vu thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateDichVuDatTiec = async (req, res) => {
  try {
    const { id, maDichVu } = req.params;
    const { soLuong, donGiaThoiDiemDat } = req.body;

    const thanhTien = soLuong * donGiaThoiDiemDat;

    const dichVu = await DatTiec.updateDichVu(id, maDichVu, {
      SoLuong: soLuong,
      DonGiaThoiDiemDat: donGiaThoiDiemDat,
      ThanhTien: thanhTien
    });

    return successResponse(res, dichVu, 'Cap nhat dich vu thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const removeDichVuDatTiec = async (req, res) => {
  try {
    const { id, maDichVu } = req.params;

    await DatTiec.removeDichVu(id, maDichVu);

    return successResponse(res, { maDichVu }, 'Xoa dich vu thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Lấy đặt tiệc theo ngày
export const getDatTiecByDate = async (req, res) => {
  try {
    const { ngay } = req.params;
    const datTiecList = await DatTiec.getByDate(ngay);
    return successResponse(res, datTiecList, 'Lay danh sach dat tiec theo ngay thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Lấy đặt tiệc theo tháng
export const getDatTiecByMonth = async (req, res) => {
  try {
    const { thang, nam } = req.params;
    const datTiecList = await DatTiec.getByMonth(thang, nam);
    return successResponse(res, datTiecList, 'Lay danh sach dat tiec theo thang thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
