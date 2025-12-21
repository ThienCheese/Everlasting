import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo chức năng
export const createChucNangSchema = Joi.object({
  tenChucNang: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten chuc nang khong duoc de trong',
    'string.min': 'Ten chuc nang phai co it nhat 2 ky tu',
    'string.max': 'Ten chuc nang khong duoc qua 100 ky tu',
    'any.required': 'Ten chuc nang la bat buoc'
  }),
  tenManHinh: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten man hinh khong duoc de trong',
    'string.min': 'Ten man hinh phai co it nhat 2 ky tu',
    'string.max': 'Ten man hinh khong duoc qua 100 ky tu',
    'any.required': 'Ten man hinh la bat buoc'
  })
});

// Schema validation cho cập nhật chức năng
export const updateChucNangSchema = Joi.object({
  tenChucNang: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten chuc nang phai co it nhat 2 ky tu',
    'string.max': 'Ten chuc nang khong duoc qua 100 ky tu'
  }),
  tenManHinh: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten man hinh phai co it nhat 2 ky tu',
    'string.max': 'Ten man hinh khong duoc qua 100 ky tu'
  })
}).min(1);

// Middleware validation
export const validateCreateChucNang = (req, res, next) => {
  const { error } = createChucNangSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateChucNang = (req, res, next) => {
  const { error } = updateChucNangSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
