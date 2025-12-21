import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo phân quyền
export const createPhanQuyenSchema = Joi.object({
  maNhom: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma nhom phai la so',
    'number.positive': 'Ma nhom phai lon hon 0',
    'any.required': 'Ma nhom la bat buoc'
  }),
  maChucNang: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma chuc nang phai la so',
    'number.positive': 'Ma chuc nang phai lon hon 0',
    'any.required': 'Ma chuc nang la bat buoc'
  })
});

// Schema validation cho cập nhật phân quyền nhóm
export const updatePhanQuyenNhomSchema = Joi.object({
  danhSachChucNang: Joi.array().items(
    Joi.number().integer().positive()
  ).required().messages({
    'array.base': 'Danh sach chuc nang phai la mang',
    'any.required': 'Danh sach chuc nang la bat buoc'
  })
});

// Middleware validation
export const validateCreatePhanQuyen = (req, res, next) => {
  const { error } = createPhanQuyenSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdatePhanQuyenNhom = (req, res, next) => {
  const { error } = updatePhanQuyenNhomSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
