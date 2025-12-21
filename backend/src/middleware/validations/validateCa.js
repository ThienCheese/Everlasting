import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo ca
export const createCaSchema = Joi.object({
  tenCa: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Ten ca khong duoc de trong',
    'string.min': 'Ten ca phai co it nhat 2 ky tu',
    'string.max': 'Ten ca khong duoc qua 50 ky tu',
    'any.required': 'Ten ca la bat buoc'
  })
});

// Schema validation cho cập nhật ca
export const updateCaSchema = Joi.object({
  tenCa: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Ten ca khong duoc de trong',
    'string.min': 'Ten ca phai co it nhat 2 ky tu',
    'string.max': 'Ten ca khong duoc qua 50 ky tu',
    'any.required': 'Ten ca la bat buoc'
  })
});

// Middleware validation
export const validateCreateCa = (req, res, next) => {
  const { error } = createCaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateCa = (req, res, next) => {
  const { error } = updateCaSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
