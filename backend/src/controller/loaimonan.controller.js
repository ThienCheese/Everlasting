import LoaiMonAn from '../models/loaimonan.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  validateLoaiMonAnCreation,
  validateLoaiMonAnUpdate,
  validateLoaiMonAnDeletion,
} from '../services/loaimonan.services.js';

export const getAllLoaiMonAn = async (req, res) => {
  try {
    const loaiMonAns = await LoaiMonAn.getAll();
    return successResponse(res, loaiMonAns, 'Lấy danh sách loại món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getLoaiMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const loaiMonAn = await LoaiMonAn.findById(id);
    if (!loaiMonAn) return errorResponse(res, 'Loại món ăn không tồn tại', 404);
    return successResponse(res, loaiMonAn, 'Lấy thông tin loại món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createLoaiMonAn = async (req, res) => {
  try {
    const { tenLoaiMonAn } = req.body;

    await validateLoaiMonAnCreation(tenLoaiMonAn);

    const loaiMonAn = await LoaiMonAn.create({
      TenLoaiMonAn: tenLoaiMonAn,
      DaXoa: false,
    });

    return successResponse(res, loaiMonAn, 'Tạo loại món ăn thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateLoaiMonAn = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenLoaiMonAn } = req.body;

    const loaiMonAn = await LoaiMonAn.findById(id);
    if (!loaiMonAn) return errorResponse(res, 'Loại món ăn không tồn tại', 404);

    await validateLoaiMonAnUpdate(id, tenLoaiMonAn);

    const updated = await LoaiMonAn.update(id, {
      TenLoaiMonAn: tenLoaiMonAn || loaiMonAn.TenLoaiMonAn,
    });

    return successResponse(res, updated, 'Cập nhật loại món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteLoaiMonAn = async (req, res) => {
  try {
    const { id } = req.params;

    const loaiMonAn = await LoaiMonAn.findById(id);
    if (!loaiMonAn) return errorResponse(res, 'Loại món ăn không tồn tại', 404);

    await validateLoaiMonAnDeletion(id);

    await LoaiMonAn.remove(id);
    return successResponse(res, null, 'Xóa loại món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
