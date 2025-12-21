import LoaiSanh from '../models/loaisanh.model.js';
import {
  validateLoaiSanhCreation,
  validateLoaiSanhUpdate,
  validateLoaiSanhDeletion,
} from '../services/loaisanh.services.js';

const createLoaiSanh = async (req, res) => {
  try {
    const { tenLoaiSanh, donGiaBanToiThieu } = req.body;

    await validateLoaiSanhCreation(tenLoaiSanh);

    const loaiSanh = await LoaiSanh.create({
      TenLoaiSanh: tenLoaiSanh,
      DonGiaBanToiThieu: donGiaBanToiThieu,
    });

    return successResponse(res, loaiSanh, 'Loại sảnh tạo thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getAllLoaiSanh = async (req, res) => {
  try {
    const loaiSanhs = await LoaiSanh.findAll();
    return successResponse(res, loaiSanhs, 'Danh sách loại sảnh', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getLoaiSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const loaiSanh = await LoaiSanh.findById(id);
    if (!loaiSanh) {
      return errorResponse(res, 'Loại sảnh không tồn tại', 404);
    }
    return successResponse(res, loaiSanh, 'Thông tin loại sảnh', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateLoaiSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { tenLoaiSanh, donGiaBanToiThieu } = req.body;

    const loaiSanh = await LoaiSanh.findById(id);
    if (!loaiSanh) {
      return errorResponse(res, 'Loại sảnh không tồn tại', 404);
    }

    await validateLoaiSanhUpdate(id, tenLoaiSanh);

    const updatedLoaiSanh = await LoaiSanh.update(id, {
      TenLoaiSanh: tenLoaiSanh || loaiSanh.TenLoaiSanh,
      DonGiaBanToiThieu:
        donGiaBanToiThieu !== undefined
          ? donGiaBanToiThieu
          : loaiSanh.DonGiaBanToiThieu,
    });

    return successResponse(res, updatedLoaiSanh, 'Cập nhật loại sảnh thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const deleteLoaiSanh = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const loaiSanh = await LoaiSanh.findById(id);
    if (!loaiSanh) {
      return errorResponse(res, 'Loại sảnh không tồn tại', 404);
    }

    await validateLoaiSanhDeletion(id);

    await LoaiSanh.temDelete(id);
    return successResponse(res, { id }, 'Xóa loại sảnh thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);;
  }
};

export default {
  createLoaiSanh,
  getAllLoaiSanh,
  getLoaiSanh,
  updateLoaiSanh,
  deleteLoaiSanh,
};
