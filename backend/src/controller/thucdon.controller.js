import ThucDon from '../models/thucdon.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';

export const getAllThucDon = async (req, res) => {
  try {
    const thucDonList = await ThucDon.getAll();
    return successResponse(res, thucDonList, 'Lay danh sach thuc don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getThucDon = async (req, res) => {
  try {
    const thucDon = await ThucDon.findById(req.params.id);
    if (!thucDon) {
      return errorResponse(res, 'Thuc don khong ton tai', 404);
    }

    const monAn = await ThucDon.getMonAn(req.params.id);
    thucDon.monAn = monAn;

    return successResponse(res, thucDon, 'Lay thong tin thuc don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createThucDon = async (req, res) => {
  try {
    const { tenThucDon, ghiChu } = req.body;

    if (!tenThucDon) {
      return errorResponse(res, 'Ten thuc don la bat buoc', 400);
    }

    const thucDon = await ThucDon.create({
      TenThucDon: tenThucDon,
      TongDonGiaThoiDiemDat: 0,
      GhiChu: ghiChu
    });

    return successResponse(res, thucDon, 'Tao thuc don thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createThucDonFromTemplate = async (req, res) => {
  try {
    const { maThucDonMau, tenThucDon, ghiChu } = req.body;

    if (!maThucDonMau) {
      return errorResponse(res, 'Ma thuc don mau la bat buoc', 400);
    }

    const thucDon = await ThucDon.createFromTemplate(maThucDonMau, tenThucDon, ghiChu);

    return successResponse(res, thucDon, 'Tao thuc don tu thuc don mau thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateThucDon = async (req, res) => {
  try {
    const id = req.params.id;
    const thucDon = await ThucDon.findById(id);
    
    if (!thucDon) {
      return errorResponse(res, 'Thuc don khong ton tai', 404);
    }

    const { tenThucDon, ghiChu } = req.body;

    const updated = await ThucDon.update(id, {
      TenThucDon: tenThucDon || thucDon.TenThucDon,
      GhiChu: ghiChu !== undefined ? ghiChu : thucDon.GhiChu
    });

    return successResponse(res, updated, 'Cap nhat thuc don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteThucDon = async (req, res) => {
  try {
    const id = req.params.id;
    
    const thucDon = await ThucDon.findById(id);
    if (!thucDon) {
      return errorResponse(res, 'Thuc don khong ton tai', 404);
    }

    // Kiểm tra xem thực đơn đã được sử dụng chưa
    const isUsed = await ThucDon.isUsedInDatTiec(id);
    if (isUsed) {
      return errorResponse(res, 'Thuc don dang duoc su dung, khong the xoa', 400);
    }

    await ThucDon.remove(id);

    return successResponse(res, { id }, 'Xoa thuc don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Quản lý món ăn trong thực đơn
export const getMonAnThucDon = async (req, res) => {
  try {
    const monAn = await ThucDon.getMonAn(req.params.id);
    return successResponse(res, monAn, 'Lay danh sach mon an thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const addMonAnThucDon = async (req, res) => {
  try {
    const { maMonAn, donGiaThoiDiemDat } = req.body;

    if (!maMonAn || !donGiaThoiDiemDat) {
      return errorResponse(res, 'Ma mon an va don gia la bat buoc', 400);
    }

    const result = await ThucDon.addMonAn(req.params.id, maMonAn, donGiaThoiDiemDat);
    
    // Cập nhật tổng đơn giá
    await ThucDon.updateTongDonGia(req.params.id);

    return successResponse(res, result, 'Them mon an vao thuc don thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateMonAnThucDon = async (req, res) => {
  try {
    const { id, maMonAn } = req.params;
    const { donGiaThoiDiemDat } = req.body;

    if (!donGiaThoiDiemDat) {
      return errorResponse(res, 'Don gia la bat buoc', 400);
    }

    const result = await ThucDon.updateMonAn(id, maMonAn, donGiaThoiDiemDat);
    
    // Cập nhật tổng đơn giá
    await ThucDon.updateTongDonGia(id);

    return successResponse(res, result, 'Cap nhat mon an trong thuc don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const removeMonAnThucDon = async (req, res) => {
  try {
    const { id, maMonAn } = req.params;

    await ThucDon.removeMonAn(id, maMonAn);
    
    // Cập nhật tổng đơn giá
    await ThucDon.updateTongDonGia(id);

    return successResponse(res, { maMonAn }, 'Xoa mon an khoi thuc don thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
