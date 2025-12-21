import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo báo cáo doanh số
export const createBaoCaoSchema = Joi.object({
  thang: Joi.number().integer().min(1).max(12).required().messages({
    'number.base': 'Thang phai la so',
    'number.min': 'Thang phai tu 1 den 12',
    'number.max': 'Thang phai tu 1 den 12',
    'any.required': 'Thang la bat buoc'
  }),
  nam: Joi.number().integer().min(2000).max(2100).required().messages({
    'number.base': 'Nam phai la so',
    'number.min': 'Nam phai lon hon 2000',
    'number.max': 'Nam khong hop le',
    'any.required': 'Nam la bat buoc'
  })
});

// Schema validation cho cập nhật báo cáo
export const updateBaoCaoSchema = Joi.object({
  thang: Joi.number().integer().min(1).max(12).messages({
    'number.min': 'Thang phai tu 1 den 12',
    'number.max': 'Thang phai tu 1 den 12'
  }),
  nam: Joi.number().integer().min(2000).max(2100).messages({
    'number.min': 'Nam phai lon hon 2000',
    'number.max': 'Nam khong hop le'
  }),
  tongDoanhThu: Joi.number().precision(2).min(0).messages({
    'number.base': 'Tong doanh thu phai la so',
    'number.min': 'Tong doanh thu phai lon hon hoac bang 0'
  })
}).min(1);

// Middleware validation
export const validateCreateBaoCao = (req, res, next) => {
  const { error } = createBaoCaoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateBaoCao = (req, res, next) => {
  const { error } = updateBaoCaoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
