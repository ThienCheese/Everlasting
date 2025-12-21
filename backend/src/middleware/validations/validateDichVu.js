import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo dịch vụ
export const createDichVuSchema = Joi.object({
  tenDichVu: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten dich vu khong duoc de trong',
    'string.min': 'Ten dich vu phai co it nhat 2 ky tu',
    'string.max': 'Ten dich vu khong duoc qua 100 ky tu',
    'any.required': 'Ten dich vu la bat buoc'
  }),
  maLoaiDichVu: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma loai dich vu phai la so',
    'number.positive': 'Ma loai dich vu phai lon hon 0',
    'any.required': 'Ma loai dich vu la bat buoc'
  }),
  donGia: Joi.number().precision(2).positive().required().messages({
    'number.base': 'Don gia phai la so',
    'number.positive': 'Don gia phai lon hon 0',
    'any.required': 'Don gia la bat buoc'
  }),
  ghiChu: Joi.string().allow('', null).max(500),
  anhURL: Joi.string().uri().allow('', null).messages({
    'string.uri': 'URL anh khong hop le'
  })
});

// Schema validation cho cập nhật dịch vụ
export const updateDichVuSchema = Joi.object({
  tenDichVu: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten dich vu phai co it nhat 2 ky tu',
    'string.max': 'Ten dich vu khong duoc qua 100 ky tu'
  }),
  maLoaiDichVu: Joi.number().integer().positive().messages({
    'number.positive': 'Ma loai dich vu phai lon hon 0'
  }),
  donGia: Joi.number().precision(2).positive().messages({
    'number.positive': 'Don gia phai lon hon 0'
  }),
  ghiChu: Joi.string().allow('', null).max(500),
  anhURL: Joi.string().uri().allow('', null).messages({
    'string.uri': 'URL anh khong hop le'
  })
}).min(1);

// Middleware validation
export const validateCreateDichVu = (req, res, next) => {
  const { error } = createDichVuSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateDichVu = (req, res, next) => {
  const { error } = updateDichVuSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
