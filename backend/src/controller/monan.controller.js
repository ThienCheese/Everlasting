import Dish from '../models/monan.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import {
  validateDishCreation,
  validateDishUpdate,
  validateDishDeletion,
} from '../services/monan.services.js';

export const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.getAll();
    return successResponse(res, dishes, 'Lấy danh sách món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);
    if (!dish) return errorResponse(res, 'Món ăn không tồn tại', 404);
    return successResponse(res, dish, 'Lấy thông tin món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createDish = async (req, res) => {
  try {
    const { tenMonAn, maLoaiMonAn, donGia, ghiChu, anhURL } = req.body;

    // Validate
    await validateDishCreation(tenMonAn, maLoaiMonAn);

    const dish = await Dish.create({
      TenMonAn: tenMonAn,
      MaLoaiMonAn: maLoaiMonAn,
      DonGia: donGia,
      GhiChu: ghiChu,
      AnhURL: anhURL,
      DaXoa: false,
    });

    return successResponse(res, dish, 'Tạo món ăn thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenMonAn, maLoaiMonAn, donGia, ghiChu, anhURL } = req.body;

    const dish = await Dish.findById(id);
    if (!dish) return errorResponse(res, 'Món ăn không tồn tại', 404);

    // Validate
    await validateDishUpdate(id, tenMonAn, maLoaiMonAn);

    const updated = await Dish.update(id, {
      TenMonAn: tenMonAn || dish.TenMonAn,
      MaLoaiMonAn: maLoaiMonAn || dish.MaLoaiMonAn,
      DonGia: donGia !== undefined ? donGia : dish.DonGia,
      GhiChu: ghiChu !== undefined ? ghiChu : dish.GhiChu,
      AnhURL: anhURL !== undefined ? anhURL : dish.AnhURL,
    });

    return successResponse(res, updated, 'Cập nhật món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findById(id);
    if (!dish) return errorResponse(res, 'Món ăn không tồn tại', 404);

    // Validate
    await validateDishDeletion(id);

    await Dish.remove(id);
    return successResponse(res, null, 'Xóa món ăn thành công', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
