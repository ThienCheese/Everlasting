import HoaDon from '../models/hoadon.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  validateHoaDonCreation,
  validateHoaDonUpdate,
  calculateHoaDon
} from '../services/hoadon.services.js';

export const getAllHoaDon = async (req, res) => {
  try {
    const hoaDonList = await HoaDon.getAll();
    return successResponse(res, hoaDonList, 'Lay danh sach hoa don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getHoaDon = async (req, res) => {
  try {
    const hoaDon = await HoaDon.findById(req.params.id);
    if (!hoaDon) {
      return errorResponse(res, 'Hoa don khong ton tai', 404);
    }
    return successResponse(res, hoaDon, 'Lay thong tin hoa don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getHoaDonByDatTiec = async (req, res) => {
  try {
    const hoaDon = await HoaDon.findByMaDatTiec(req.params.maDatTiec);
    if (!hoaDon) {
      return errorResponse(res, 'Hoa don khong ton tai', 404);
    }
    return successResponse(res, hoaDon, 'Lay thong tin hoa don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createHoaDon = async (req, res) => {
  try {
    const { maDatTiec, ngayThanhToan, apDungQuyDinhPhat } = req.body;

    // Validate
    await validateHoaDonCreation(maDatTiec);

    // Tính toán hóa đơn
    const hoaDonData = await calculateHoaDon(maDatTiec, ngayThanhToan, apDungQuyDinhPhat);

    const hoaDon = await HoaDon.create({
      MaDatTiec: maDatTiec,
      NgayThanhToan: ngayThanhToan,
      NgayLapHoaDon: new Date(),
      ...hoaDonData
    });

    return successResponse(res, hoaDon, 'Tao hoa don thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateHoaDon = async (req, res) => {
  try {
    const id = req.params.id;
    const hoaDon = await HoaDon.findById(id);
    
    if (!hoaDon) {
      return errorResponse(res, 'Hoa don khong ton tai', 404);
    }

    const updateData = req.body;

    // Validate
    await validateHoaDonUpdate(id, updateData);

    const updated = await HoaDon.update(id, {
      NgayThanhToan: updateData.ngayThanhToan || hoaDon.NgayThanhToan,
      TongTienBan: updateData.tongTienBan !== undefined ? updateData.tongTienBan : hoaDon.TongTienBan,
      TongTienDichVu: updateData.tongTienDichVu !== undefined ? updateData.tongTienDichVu : hoaDon.TongTienDichVu,
      TongTienHoaDon: updateData.tongTienHoaDon !== undefined ? updateData.tongTienHoaDon : hoaDon.TongTienHoaDon,
      ApDungQuyDinhPhat: updateData.apDungQuyDinhPhat !== undefined ? updateData.apDungQuyDinhPhat : hoaDon.ApDungQuyDinhPhat,
      PhanTramPhatMotNgay: updateData.phanTramPhatMotNgay !== undefined ? updateData.phanTramPhatMotNgay : hoaDon.PhanTramPhatMotNgay,
      TongTienPhat: updateData.tongTienPhat !== undefined ? updateData.tongTienPhat : hoaDon.TongTienPhat,
      TongTienConLai: updateData.tongTienConLai !== undefined ? updateData.tongTienConLai : hoaDon.TongTienConLai,
      TrangThai: updateData.trangThai !== undefined ? updateData.trangThai : hoaDon.TrangThai
    });

    return successResponse(res, updated, 'Cap nhat hoa don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateTrangThaiHoaDon = async (req, res) => {
  try {
    const id = req.params.id;
    const { trangThai } = req.body;

    const hoaDon = await HoaDon.findById(id);
    if (!hoaDon) {
      return errorResponse(res, 'Hoa don khong ton tai', 404);
    }

    const updated = await HoaDon.updateTrangThai(id, trangThai);

    return successResponse(res, updated, 'Cap nhat trang thai hoa don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteHoaDon = async (req, res) => {
  try {
    const id = req.params.id;
    
    const hoaDon = await HoaDon.findById(id);
    if (!hoaDon) {
      return errorResponse(res, 'Hoa don khong ton tai', 404);
    }

    await HoaDon.remove(id);

    return successResponse(res, { id }, 'Xoa hoa don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getHoaDonByMonth = async (req, res) => {
  try {
    const { thang, nam } = req.params;
    const hoaDonList = await HoaDon.getByMonth(thang, nam);
    return successResponse(res, hoaDonList, 'Lay danh sach hoa don theo thang thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getHoaDonByTrangThai = async (req, res) => {
  try {
    const { trangThai } = req.params;
    const hoaDonList = await HoaDon.getByTrangThai(trangThai);
    return successResponse(res, hoaDonList, 'Lay danh sach hoa don theo trang thai thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
