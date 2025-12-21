import LoaiDichVu from '../models/loaidichvu.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  validateLoaiDichVuCreation,
  validateLoaiDichVuUpdate,
  validateLoaiDichVuDeletion,
} from '../services/loaidichvu.services.js';

export const getAllLoaiDichVu = async (req, res) => {
  try {
    const loaiDichVus = await LoaiDichVu.getAll();
    return successResponse(res, loaiDichVus, 'Lấy danh sách loại dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getLoaiDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const loaiDichVu = await LoaiDichVu.findById(id);
    if (!loaiDichVu) return errorResponse(res, 'Loại dịch vụ không tồn tại', 404);
    return successResponse(res, loaiDichVu, 'Lấy thông tin loại dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createLoaiDichVu = async (req, res) => {
  try {
    const { tenLoaiDichVu } = req.body;

    await validateLoaiDichVuCreation(tenLoaiDichVu);

    const loaiDichVu = await LoaiDichVu.create({
      TenLoaiDichVu: tenLoaiDichVu,
      DaXoa: false,
    });

    return successResponse(res, loaiDichVu, 'Tạo loại dịch vụ thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateLoaiDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenLoaiDichVu } = req.body;

    const loaiDichVu = await LoaiDichVu.findById(id);
    if (!loaiDichVu) return errorResponse(res, 'Loại dịch vụ không tồn tại', 404);

    await validateLoaiDichVuUpdate(id, tenLoaiDichVu);

    const updated = await LoaiDichVu.update(id, {
      TenLoaiDichVu: tenLoaiDichVu || loaiDichVu.TenLoaiDichVu,
    });

    return successResponse(res, updated, 'Cập nhật loại dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteLoaiDichVu = async (req, res) => {
  try {
    const { id } = req.params;

    const loaiDichVu = await LoaiDichVu.findById(id);
    if (!loaiDichVu) return errorResponse(res, 'Loại dịch vụ không tồn tại', 404);

    await validateLoaiDichVuDeletion(id);

    await LoaiDichVu.remove(id);
    return successResponse(res, null, 'Xóa loại dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
