import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo thực đơn
export const createThucDonSchema = Joi.object({
  tenThucDon: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten thuc don khong duoc de trong',
    'string.min': 'Ten thuc don phai co it nhat 2 ky tu',
    'string.max': 'Ten thuc don khong duoc qua 100 ky tu',
    'any.required': 'Ten thuc don la bat buoc'
  }),
  donGiaHienTai: Joi.number().precision(2).positive().required().messages({
    'number.base': 'Don gia hien tai phai la so',
    'number.positive': 'Don gia hien tai phai lon hon 0',
    'any.required': 'Don gia hien tai la bat buoc'
  }),
  ghiChu: Joi.string().allow('', null).max(500)
});

// Schema validation cho tạo thực đơn từ template
export const createFromTemplateSchema = Joi.object({
  maThucDonMau: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma thuc don mau phai la so',
    'number.positive': 'Ma thuc don mau phai lon hon 0',
    'any.required': 'Ma thuc don mau la bat buoc'
  }),
  tenThucDon: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten thuc don phai co it nhat 2 ky tu',
    'string.max': 'Ten thuc don khong duoc qua 100 ky tu'
  }),
  ghiChu: Joi.string().allow('', null).max(500)
});

// Schema validation cho cập nhật thực đơn
export const updateThucDonSchema = Joi.object({
  tenThucDon: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten thuc don phai co it nhat 2 ky tu',
    'string.max': 'Ten thuc don khong duoc qua 100 ky tu'
  }),
  donGiaHienTai: Joi.number().precision(2).positive().messages({
    'number.base': 'Don gia hien tai phai la so',
    'number.positive': 'Don gia hien tai phai lon hon 0'
  }),
  ghiChu: Joi.string().allow('', null).max(500)
}).min(1);

// Schema validation cho thêm món ăn vào thực đơn
export const addMonAnSchema = Joi.object({
  maMonAn: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma mon an phai la so',
    'number.positive': 'Ma mon an phai lon hon 0',
    'any.required': 'Ma mon an la bat buoc'
  }),
  donGiaThoiDiemDat: Joi.number().precision(2).positive().required().messages({
    'number.base': 'Don gia phai la so',
    'number.positive': 'Don gia phai lon hon 0',
    'any.required': 'Don gia la bat buoc'
  })
});

// Schema validation cho cập nhật món ăn trong thực đơn
export const updateMonAnSchema = Joi.object({
  donGiaThoiDiemDat: Joi.number().precision(2).positive().required().messages({
    'number.base': 'Don gia phai la so',
    'number.positive': 'Don gia phai lon hon 0',
    'any.required': 'Don gia la bat buoc'
  })
});

// Middleware validation
export const validateCreateThucDon = (req, res, next) => {
  const { error } = createThucDonSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateCreateFromTemplate = (req, res, next) => {
  const { error } = createFromTemplateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateThucDon = (req, res, next) => {
  const { error } = updateThucDonSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateAddMonAn = (req, res, next) => {
  const { error } = addMonAnSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateMonAn = (req, res, next) => {
  const { error } = updateMonAnSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
