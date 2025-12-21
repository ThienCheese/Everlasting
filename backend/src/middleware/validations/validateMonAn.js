import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo món ăn
export const createDishSchema = Joi.object({
  tenMonAn: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten mon an khong duoc de trong',
    'string.min': 'Ten mon an phai co it nhat 2 ky tu',
    'string.max': 'Ten mon an khong duoc qua 100 ky tu',
    'any.required': 'Ten mon an la bat buoc'
  }),
  maLoaiMonAn: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma loai mon an phai la so',
    'number.positive': 'Ma loai mon an phai lon hon 0',
    'any.required': 'Ma loai mon an la bat buoc'
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

// Schema validation cho cập nhật món ăn
export const updateDishSchema = Joi.object({
  tenMonAn: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten mon an phai co it nhat 2 ky tu',
    'string.max': 'Ten mon an khong duoc qua 100 ky tu'
  }),
  maLoaiMonAn: Joi.number().integer().positive().messages({
    'number.positive': 'Ma loai mon an phai lon hon 0'
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
export const validateCreateDish = (req, res, next) => {
  const { error } = createDishSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateDish = (req, res, next) => {
  const { error } = updateDishSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
