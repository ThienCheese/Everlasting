import ChucNang from '../models/chucnang.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';

export const getAllChucNang = async (req, res) => {
  try {
    const chucNangList = await ChucNang.getAll();
    return successResponse(res, chucNangList, 'Lay danh sach chuc nang thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getChucNang = async (req, res) => {
  try {
    const chucNang = await ChucNang.findById(req.params.id);
    if (!chucNang) {
      return errorResponse(res, 'Chuc nang khong ton tai', 404);
    }
    return successResponse(res, chucNang, 'Lay thong tin chuc nang thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createChucNang = async (req, res) => {
  try {
    const { tenChucNang, tenManHinh } = req.body;

    if (!tenChucNang || !tenManHinh) {
      return errorResponse(res, 'Ten chuc nang va ten man hinh la bat buoc', 400);
    }

    // Kiểm tra trùng tên
    const existing = await ChucNang.findByTen(tenChucNang);
    if (existing) {
      return errorResponse(res, 'Ten chuc nang da ton tai', 400);
    }

    const chucNang = await ChucNang.create({
      TenChucNang: tenChucNang,
      TenManHinh: tenManHinh
    });

    return successResponse(res, chucNang, 'Tao chuc nang thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateChucNang = async (req, res) => {
  try {
    const id = req.params.id;
    const chucNang = await ChucNang.findById(id);
    
    if (!chucNang) {
      return errorResponse(res, 'Chuc nang khong ton tai', 404);
    }

    const { tenChucNang, tenManHinh } = req.body;

    // Kiểm tra trùng tên (nếu thay đổi tên)
    if (tenChucNang && tenChucNang !== chucNang.TenChucNang) {
      const existing = await ChucNang.findByTen(tenChucNang);
      if (existing) {
        return errorResponse(res, 'Ten chuc nang da ton tai', 400);
      }
    }

    const updated = await ChucNang.update(id, {
      TenChucNang: tenChucNang || chucNang.TenChucNang,
      TenManHinh: tenManHinh || chucNang.TenManHinh
    });

    return successResponse(res, updated, 'Cap nhat chuc nang thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteChucNang = async (req, res) => {
  try {
    const id = req.params.id;
    
    const chucNang = await ChucNang.findById(id);
    if (!chucNang) {
      return errorResponse(res, 'Chuc nang khong ton tai', 404);
    }

    await ChucNang.remove(id);

    return successResponse(res, { id }, 'Xoa chuc nang thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
