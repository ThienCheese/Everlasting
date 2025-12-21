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
    const { phanTramPhatTrenNgay } = req.body;

    if (phanTramPhatTrenNgay === undefined || phanTramPhatTrenNgay === null) {
      return errorResponse(res, 'Phan tram phat tren ngay la bat buoc', 400);
    }

    if (phanTramPhatTrenNgay < 0 || phanTramPhatTrenNgay > 100) {
      return errorResponse(res, 'Phan tram phat phai nam trong khoang 0-100', 400);
    }

    const thamSo = await ThamSo.update({
      PhanTramPhatTrenNgay: phanTramPhatTrenNgay
    });

    return successResponse(res, thamSo, 'Cap nhat tham so thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
