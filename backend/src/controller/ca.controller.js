import Ca from '../models/ca.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  validateCaCreation,
  validateCaUpdate,
  validateCaDeletion,
} from '../services/ca.services.js';

export const getAllCa = async (req, res) => {
  try {
    const cas = await Ca.getAll();
    return successResponse(res, cas, 'Lấy danh sách ca thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCa = async (req, res) => {
  try {
    const { id } = req.params;
    const ca = await Ca.findById(id);
    if (!ca) return errorResponse(res, 'Ca không tồn tại', 404);
    return successResponse(res, ca, 'Lấy thông tin ca thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createCa = async (req, res) => {
  try {
    const { tenCa } = req.body;

    await validateCaCreation(tenCa);

    const ca = await Ca.create({
      TenCa: tenCa,
      DaXoa: false,
    });

    return successResponse(res, ca, 'Tạo ca thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateCa = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenCa } = req.body;

    const ca = await Ca.findById(id);
    if (!ca) return errorResponse(res, 'Ca không tồn tại', 404);

    await validateCaUpdate(id, tenCa);

    const updated = await Ca.update(id, {
      TenCa: tenCa || ca.TenCa,
    });

    return successResponse(res, updated, 'Cập nhật ca thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteCa = async (req, res) => {
  try {
    const { id } = req.params;

    const ca = await Ca.findById(id);
    if (!ca) return errorResponse(res, 'Ca không tồn tại', 404);

    await validateCaDeletion(id);

    await Ca.remove(id);
    return successResponse(res, null, 'Xóa ca thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
