import Hall from '../models/sanh.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import { validateHallCreation, validateHallUpdate, validateHallDeletion} from '../services/sanh.services.js';

export const getHalls = async (req, res) => {
  try {
    const halls = await Hall.getAll();
    return successResponse(res, halls, 'Lay danh sach thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getHall = async (req, res) => {
  try {
    
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return errorResponse(res, 'Sanh khong ton tai', 404);
    }
    return successResponse(res, hall, 'Lay danh sach sanh thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createHall = async (req, res) => {
  try {
    const { tenSanh, maLoaiSanh, soLuongBanToiDa, ghiChu, anhURL } = req.body;

    // gọi service để validate
    await validateHallCreation(tenSanh, maLoaiSanh);

    const hall = await Hall.create({
      TenSanh: tenSanh,
      MaLoaiSanh: maLoaiSanh,
      SoLuongBanToiDa: soLuongBanToiDa,
      GhiChu: ghiChu,
      AnhURL: anhURL,
    });
    return successResponse(res, hall, 'Tao sanh thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateHall = async (req, res) => {
  try {
    const id = req.params.id;
    const { tenSanh, maLoaiSanh,soLuongBanToiDa,ghiChu, anhURL } = req.body;

    const hall = await Hall.findById(id);
    if (!hall) return errorResponse(res, 'Sanh khong ton tai', 404);

    // gọi service để validate
    await validateHallUpdate(id, tenSanh, maLoaiSanh);

    const updated = await Hall.update(id, {
      TenSanh: tenSanh || hall.TenSanh,
      MaLoaiSanh: maLoaiSanh || hall.MaLoaiSanh,
      SoLuongBanToiDa:
        soLuongBanToiDa !== undefined ? soLuongBanToiDa : hall.SoLuongBanToiDa,
      GhiChu: ghiChu !== undefined ? ghiChu : hall.GhiChu,
      AnhURL: anhURL !== undefined ? anhURL : hall.AnhURL,
    });

    return successResponse(res, updated, 'Cap nhat sanh thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteHall = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const hall = await Hall.findById(id);
    if (!hall) return errorResponse(res, 'Sanh khong ton tai', 404);

    // gọi service để validate
    await validateHallDeletion(id);

    const deleted = await Hall.remove(id);
    return successResponse(res, { id: deleted }, 'Xoa sanh thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
