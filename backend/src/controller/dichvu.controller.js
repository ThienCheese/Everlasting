import DichVu from '../models/dichvu.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  validateDichVuCreation,
  validateDichVuUpdate,
  validateDichVuDeletion,
} from '../services/dichvu.services.js';

export const getAllDichVu = async (req, res) => {
  try {
    const dichVus = await DichVu.getAll();
    return successResponse(res, dichVus, 'Lấy danh sách dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const dichVu = await DichVu.findById(id);
    if (!dichVu) return errorResponse(res, 'Dịch vụ không tồn tại', 404);
    return successResponse(res, dichVu, 'Lấy thông tin dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createDichVu = async (req, res) => {
  try {
    const { tenDichVu, maLoaiDichVu, donGia, ghiChu, anhURL } = req.body;

    await validateDichVuCreation(tenDichVu, maLoaiDichVu);

    const dichVu = await DichVu.create({
      TenDichVu: tenDichVu,
      MaLoaiDichVu: maLoaiDichVu,
      DonGia: donGia,
      GhiChu: ghiChu,
      AnhURL: anhURL,
      DaXoa: false,
    });

    return successResponse(res, dichVu, 'Tạo dịch vụ thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenDichVu, maLoaiDichVu, donGia, ghiChu, anhURL } = req.body;

    const dichVu = await DichVu.findById(id);
    if (!dichVu) return errorResponse(res, 'Dịch vụ không tồn tại', 404);

    await validateDichVuUpdate(id, tenDichVu, maLoaiDichVu);

    const updated = await DichVu.update(id, {
      TenDichVu: tenDichVu || dichVu.TenDichVu,
      MaLoaiDichVu: maLoaiDichVu || dichVu.MaLoaiDichVu,
      DonGia: donGia !== undefined ? donGia : dichVu.DonGia,
      GhiChu: ghiChu !== undefined ? ghiChu : dichVu.GhiChu,
      AnhURL: anhURL !== undefined ? anhURL : dichVu.AnhURL,
    });

    return successResponse(res, updated, 'Cập nhật dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteDichVu = async (req, res) => {
  try {
    const { id } = req.params;

    const dichVu = await DichVu.findById(id);
    if (!dichVu) return errorResponse(res, 'Dịch vụ không tồn tại', 404);

    await validateDichVuDeletion(id);

    await DichVu.remove(id);
    return successResponse(res, null, 'Xóa dịch vụ thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
