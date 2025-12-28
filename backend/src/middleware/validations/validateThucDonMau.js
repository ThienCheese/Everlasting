import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo thực đơn mẫu
export const createThucDonMauSchema = Joi.object({
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
  ,
  anhURL: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Anh URL phai la duong dan hop le'
  })
});

// Schema validation cho cập nhật thực đơn mẫu
export const updateThucDonMauSchema = Joi.object({
  tenThucDon: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten thuc don phai co it nhat 2 ky tu',
    'string.max': 'Ten thuc don khong duoc qua 100 ky tu'
  }),
  donGiaHienTai: Joi.number().precision(2).positive().messages({
    'number.base': 'Don gia hien tai phai la so',
    'number.positive': 'Don gia hien tai phai lon hon 0'
  }),
  ghiChu: Joi.string().allow('', null).max(500)
  ,
  anhURL: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Anh URL phai la duong dan hop le'
  })
}).min(1);

// Schema validation cho thêm món ăn vào thực đơn mẫu (không cần giá tại thời điểm đặt)
export const addMonAnToTemplateSchema = Joi.object({
  maMonAn: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma mon an phai la so',
    'number.positive': 'Ma mon an phai lon hon 0',
    'any.required': 'Ma mon an la bat buoc'
  })
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

// Middleware validation cho tạo thực đơn mẫu
export const validateCreateThucDonMau = (req, res, next) => {
  const { error } = createThucDonMauSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

// Middleware validation cho cập nhật thực đơn mẫu
export const validateUpdateThucDonMau = (req, res, next) => {
  const { error } = updateThucDonMauSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

// Middleware validation cho thêm món ăn vào thực đơn mẫu
export const validateAddMonAnToTemplate = (req, res, next) => {
  const { error } = addMonAnToTemplateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

// Middleware validation cho tạo thực đơn từ template
export const validateCreateFromTemplate = (req, res, next) => {
  const { error } = createFromTemplateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
