import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo hóa đơn
export const createHoaDonSchema = Joi.object({
  maDatTiec: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma dat tiec phai la so',
    'number.positive': 'Ma dat tiec phai lon hon 0',
    'any.required': 'Ma dat tiec la bat buoc'
  }),
  ngayThanhToan: Joi.date().iso().required().messages({
    'date.format': 'Ngay thanh toan khong hop le (YYYY-MM-DD)',
    'any.required': 'Ngay thanh toan la bat buoc'
  }),
  apDungQuyDinhPhat: Joi.boolean().default(false).messages({
    'boolean.base': 'Ap dung quy dinh phat phai la true/false'
  })
});

// Schema validation cho cập nhật hóa đơn
export const updateHoaDonSchema = Joi.object({
  ngayThanhToan: Joi.date().iso().messages({
    'date.format': 'Ngay thanh toan khong hop le (YYYY-MM-DD)'
  }),
  tongTienBan: Joi.number().precision(2).min(0).messages({
    'number.base': 'Tong tien ban phai la so',
    'number.min': 'Tong tien ban phai lon hon hoac bang 0'
  }),
  tongTienDichVu: Joi.number().precision(2).min(0).messages({
    'number.base': 'Tong tien dich vu phai la so',
    'number.min': 'Tong tien dich vu phai lon hon hoac bang 0'
  }),
  tongTienHoaDon: Joi.number().precision(2).min(0).messages({
    'number.base': 'Tong tien hoa don phai la so',
    'number.min': 'Tong tien hoa don phai lon hon hoac bang 0'
  }),
  apDungQuyDinhPhat: Joi.boolean().messages({
    'boolean.base': 'Ap dung quy dinh phat phai la true/false'
  }),
  phanTramPhatMotNgay: Joi.number().precision(2).min(0).max(100).messages({
    'number.base': 'Phan tram phat phai la so',
    'number.min': 'Phan tram phat phai lon hon hoac bang 0',
    'number.max': 'Phan tram phat khong duoc qua 100'
  }),
  tongTienPhat: Joi.number().precision(2).min(0).messages({
    'number.base': 'Tong tien phat phai la so',
    'number.min': 'Tong tien phat phai lon hon hoac bang 0'
  }),
  tongTienConLai: Joi.number().precision(2).messages({
    'number.base': 'Tong tien con lai phai la so'
  }),
  trangThai: Joi.number().integer().valid(0, 1).messages({
    'number.base': 'Trang thai phai la so',
    'any.only': 'Trang thai phai la 0 (chua thanh toan) hoac 1 (da thanh toan)'
  })
}).min(1);

// Schema validation cho cập nhật trạng thái
export const updateTrangThaiSchema = Joi.object({
  trangThai: Joi.number().integer().valid(0, 1).required().messages({
    'number.base': 'Trang thai phai la so',
    'any.only': 'Trang thai phai la 0 (chua thanh toan) hoac 1 (da thanh toan)',
    'any.required': 'Trang thai la bat buoc'
  })
});

// Middleware validation
export const validateCreateHoaDon = (req, res, next) => {
  const { error } = createHoaDonSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateHoaDon = (req, res, next) => {
  const { error } = updateHoaDonSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateTrangThai = (req, res, next) => {
  const { error } = updateTrangThaiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
