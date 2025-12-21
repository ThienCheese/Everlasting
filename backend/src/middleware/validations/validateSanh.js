import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo sảnh
export const createHallSchema = Joi.object({
  tenSanh: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten sanh khong duoc de trong',
    'string.min': 'Ten sanh phai co it nhat 2 ky tu',
    'string.max': 'Ten sanh khong duoc qua 100 ky tu',
    'any.required': 'Ten sanh la bat buoc'
  }),
  maLoaiSanh: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma loai sanh phai la so',
    'number.positive': 'Ma loai sanh phai lon hon 0',
    'any.required': 'Ma loai sanh la bat buoc'
  }),
  soLuongBanToiDa: Joi.number().integer().positive().min(1).required().messages({
    'number.base': 'So luong ban toi da phai la so',
    'number.min': 'So luong ban toi da phai lon hon 0',
    'any.required': 'So luong ban toi da la bat buoc'
  }),
  ghiChu: Joi.string().allow('', null).max(500),
  anhURL: Joi.string().uri().allow('', null).messages({
    'string.uri': 'URL anh khong hop le'
  })
});

// Schema validation cho cập nhật sảnh
export const updateHallSchema = Joi.object({
  tenSanh: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten sanh phai co it nhat 2 ky tu',
    'string.max': 'Ten sanh khong duoc qua 100 ky tu'
  }),
  maLoaiSanh: Joi.number().integer().positive().messages({
    'number.positive': 'Ma loai sanh phai lon hon 0'
  }),
  soLuongBanToiDa: Joi.number().integer().positive().min(1).messages({
    'number.min': 'So luong ban toi da phai lon hon 0'
  }),
  ghiChu: Joi.string().allow('', null).max(500),
  anhURL: Joi.string().uri().allow('', null).messages({
    'string.uri': 'URL anh khong hop le'
  })
}).min(1);

// Middleware validation cho tạo sảnh
export const validateCreateHall = (req, res, next) => {
  const { error } = createHallSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

// Middleware validation cho cập nhật sảnh
export const validateUpdateHall = (req, res, next) => {
  const { error } = updateHallSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
