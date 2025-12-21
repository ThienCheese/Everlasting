import PhanQuyen from '../models/phanquyen.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';

export const getAllPhanQuyen = async (req, res) => {
  try {
    const phanQuyenList = await PhanQuyen.getAll();
    return successResponse(res, phanQuyenList, 'Lay danh sach phan quyen thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPhanQuyenByNhom = async (req, res) => {
  try {
    const { maNhom } = req.params;
    const phanQuyenList = await PhanQuyen.getByNhom(maNhom);
    return successResponse(res, phanQuyenList, 'Lay phan quyen cua nhom thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPhanQuyenByChucNang = async (req, res) => {
  try {
    const { maChucNang } = req.params;
    const phanQuyenList = await PhanQuyen.getByChucNang(maChucNang);
    return successResponse(res, phanQuyenList, 'Lay phan quyen cua chuc nang thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const checkPermission = async (req, res) => {
  try {
    const { maNhom, maChucNang } = req.params;
    const hasPermission = await PhanQuyen.checkPermission(maNhom, maChucNang);
    return successResponse(res, { hasPermission }, 'Kiem tra quyen thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createPhanQuyen = async (req, res) => {
  try {
    const { maNhom, maChucNang } = req.body;

    if (!maNhom || !maChucNang) {
      return errorResponse(res, 'Ma nhom va ma chuc nang la bat buoc', 400);
    }

    const phanQuyen = await PhanQuyen.create({
      MaNhom: maNhom,
      MaChucNang: maChucNang
    });

    return successResponse(res, phanQuyen, 'Them phan quyen thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deletePhanQuyen = async (req, res) => {
  try {
    const { maNhom, maChucNang } = req.params;

    await PhanQuyen.remove(maNhom, maChucNang);

    return successResponse(res, { maNhom, maChucNang }, 'Xoa phan quyen thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updatePhanQuyenNhom = async (req, res) => {
  try {
    const { maNhom } = req.params;
    const { danhSachChucNang } = req.body;

    if (!Array.isArray(danhSachChucNang)) {
      return errorResponse(res, 'Danh sach chuc nang phai la mang', 400);
    }

    const phanQuyenList = await PhanQuyen.updateByNhom(maNhom, danhSachChucNang);

    return successResponse(res, phanQuyenList, 'Cap nhat phan quyen nhom thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
