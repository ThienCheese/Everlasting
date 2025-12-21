import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo/cập nhật tham số
export const thamSoSchema = Joi.object({
  phanTramPhatTrenNgay: Joi.number().precision(2).min(0).max(100).required().messages({
    'number.base': 'Phan tram phat tren ngay phai la so',
    'number.min': 'Phan tram phat phai lon hon hoac bang 0',
    'number.max': 'Phan tram phat khong duoc qua 100',
    'any.required': 'Phan tram phat tren ngay la bat buoc'
  })
});

// Middleware validation
export const validateThamSo = (req, res, next) => {
  const { error } = thamSoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
