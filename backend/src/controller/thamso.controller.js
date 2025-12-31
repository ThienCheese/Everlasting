import ThamSo from '../models/thamso.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';

export const getThamSo = async (req, res) => {
  try {
    const thamSo = await ThamSo.get();
    if (!thamSo) {
      return errorResponse(res, 'Tham so chua duoc khoi tao', 404);
    }
    return successResponse(res, thamSo, 'Lay tham so thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateThamSo = async (req, res) => {
  try {
    const { phanTramPhatTrenNgay, phanTramCoc } = req.body;

    // Kiểm tra ít nhất 1 trường được gửi
    if (phanTramPhatTrenNgay === undefined && phanTramCoc === undefined) {
      return errorResponse(res, 'Phải cung cấp ít nhất 1 tham số để cập nhật', 400);
    }

    const updateData = {};

    if (phanTramPhatTrenNgay !== undefined) {
      if (phanTramPhatTrenNgay < 0 || phanTramPhatTrenNgay > 100) {
        return errorResponse(res, 'Phan tram phat phai nam trong khoang 0-100', 400);
      }
      updateData.PhanTramPhatTrenNgay = phanTramPhatTrenNgay;
    }

    if (phanTramCoc !== undefined) {
      if (phanTramCoc < 0 || phanTramCoc > 100) {
        return errorResponse(res, 'Phan tram coc phai nam trong khoang 0-100', 400);
      }
      updateData.PhanTramCoc = phanTramCoc;
    }

    const thamSo = await ThamSo.update(updateData);

    return successResponse(res, thamSo, 'Cap nhat tham so thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
