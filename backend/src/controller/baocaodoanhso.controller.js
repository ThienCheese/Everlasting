import BaoCaoDoanhSo from '../models/baocaodoanhso.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import { generateBaoCaoDoanhSo } from '../services/baocaodoanhso.services.js';

export const getAllBaoCao = async (req, res) => {
  try {
    const baoCaoList = await BaoCaoDoanhSo.getAll();
    return successResponse(res, baoCaoList, 'Lay danh sach bao cao thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getBaoCao = async (req, res) => {
  try {
    const baoCao = await BaoCaoDoanhSo.findById(req.params.id);
    if (!baoCao) {
      return errorResponse(res, 'Bao cao khong ton tai', 404);
    }

    // Lấy chi tiết báo cáo
    const chiTiet = await BaoCaoDoanhSo.getChiTiet(baoCao.MaBaoCaoDoanhSo);
    baoCao.chiTiet = chiTiet;

    return successResponse(res, baoCao, 'Lay thong tin bao cao thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getBaoCaoByThangNam = async (req, res) => {
  try {
    const { thang, nam } = req.params;
    
    let baoCao = await BaoCaoDoanhSo.findByThangNam(parseInt(thang), parseInt(nam));
    
    if (!baoCao) {
      return errorResponse(res, 'Bao cao khong ton tai', 404);
    }

    // Lấy chi tiết báo cáo
    const chiTiet = await BaoCaoDoanhSo.getChiTiet(baoCao.MaBaoCaoDoanhSo);
    baoCao.chiTiet = chiTiet;

    return successResponse(res, baoCao, 'Lay bao cao thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createBaoCao = async (req, res) => {
  try {
    const { thang, nam } = req.body;

    // Kiểm tra xem đã có báo cáo chưa
    const existing = await BaoCaoDoanhSo.findByThangNam(thang, nam);
    if (existing) {
      return errorResponse(res, 'Bao cao thang nay da ton tai', 400);
    }

    // Tạo báo cáo
    const baoCao = await generateBaoCaoDoanhSo(thang, nam);

    return successResponse(res, baoCao, 'Tao bao cao doanh so thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateBaoCao = async (req, res) => {
  try {
    const id = req.params.id;
    const baoCao = await BaoCaoDoanhSo.findById(id);
    
    if (!baoCao) {
      return errorResponse(res, 'Bao cao khong ton tai', 404);
    }

    const updateData = req.body;

    const updated = await BaoCaoDoanhSo.update(id, {
      Thang: updateData.thang || baoCao.Thang,
      Nam: updateData.nam || baoCao.Nam,
      TongDoanhThu: updateData.tongDoanhThu !== undefined ? updateData.tongDoanhThu : baoCao.TongDoanhThu
    });

    return successResponse(res, updated, 'Cap nhat bao cao thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteBaoCao = async (req, res) => {
  try {
    const id = req.params.id;
    
    const baoCao = await BaoCaoDoanhSo.findById(id);
    if (!baoCao) {
      return errorResponse(res, 'Bao cao khong ton tai', 404);
    }

    await BaoCaoDoanhSo.remove(id);

    return successResponse(res, { id }, 'Xoa bao cao thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getBaoCaoByNam = async (req, res) => {
  try {
    const { nam } = req.params;
    const baoCaoList = await BaoCaoDoanhSo.getByNam(parseInt(nam));
    return successResponse(res, baoCaoList, 'Lay bao cao theo nam thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
