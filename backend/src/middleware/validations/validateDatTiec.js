import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo đặt tiệc
export const createDatTiecSchema = Joi.object({
  tenChuRe: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten chu re khong duoc de trong',
    'string.min': 'Ten chu re phai co it nhat 2 ky tu',
    'string.max': 'Ten chu re khong duoc qua 100 ky tu',
    'any.required': 'Ten chu re la bat buoc'
  }),
  tenCoDau: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten co dau khong duoc de trong',
    'string.min': 'Ten co dau phai co it nhat 2 ky tu',
    'string.max': 'Ten co dau khong duoc qua 100 ky tu',
    'any.required': 'Ten co dau la bat buoc'
  }),
  dienThoai: Joi.string().trim().pattern(/^[0-9]{10,11}$/).required().messages({
    'string.empty': 'Dien thoai khong duoc de trong',
    'string.pattern.base': 'Dien thoai phai la 10-11 chu so',
    'any.required': 'Dien thoai la bat buoc'
  }),
  ngayDatTiec: Joi.date().iso().messages({
    'date.format': 'Ngay dat tiec khong hop le (YYYY-MM-DD)'
  }),
  ngayDaiTiec: Joi.date().iso().min('now').required().messages({
    'date.format': 'Ngay dai tiec khong hop le (YYYY-MM-DD)',
    'date.min': 'Ngay dai tiec phai lon hon hoac bang ngay hien tai',
    'any.required': 'Ngay dai tiec la bat buoc'
  }),
  maCa: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma ca phai la so',
    'number.positive': 'Ma ca phai lon hon 0',
    'any.required': 'Ma ca la bat buoc'
  }),
  maSanh: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma sanh phai la so',
    'number.positive': 'Ma sanh phai lon hon 0',
    'any.required': 'Ma sanh la bat buoc'
  }),
  maThucDon: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma thuc don phai la so',
    'number.positive': 'Ma thuc don phai lon hon 0',
    'any.required': 'Ma thuc don la bat buoc'
  }),
  tienDatCoc: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Tien dat coc phai la so',
    'number.min': 'Tien dat coc phai lon hon hoac bang 0',
    'any.required': 'Tien dat coc la bat buoc'
  }),
  soLuongBan: Joi.number().integer().positive().min(1).required().messages({
    'number.base': 'So luong ban phai la so',
    'number.min': 'So luong ban phai lon hon 0',
    'any.required': 'So luong ban la bat buoc'
  }),
  soBanDuTru: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'So ban du tru phai la so',
    'number.min': 'So ban du tru phai lon hon hoac bang 0'
  })
});

// Schema validation cho cập nhật đặt tiệc
export const updateDatTiecSchema = Joi.object({
  tenChuRe: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten chu re phai co it nhat 2 ky tu',
    'string.max': 'Ten chu re khong duoc qua 100 ky tu'
  }),
  tenCoDau: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten co dau phai co it nhat 2 ky tu',
    'string.max': 'Ten co dau khong duoc qua 100 ky tu'
  }),
  dienThoai: Joi.string().trim().pattern(/^[0-9]{10,11}$/).messages({
    'string.pattern.base': 'Dien thoai phai la 10-11 chu so'
  }),
  ngayDaiTiec: Joi.date().iso().min('now').messages({
    'date.format': 'Ngay dai tiec khong hop le (YYYY-MM-DD)',
    'date.min': 'Ngay dai tiec phai lon hon hoac bang ngay hien tai'
  }),
  maCa: Joi.number().integer().positive().messages({
    'number.positive': 'Ma ca phai lon hon 0'
  }),
  maSanh: Joi.number().integer().positive().messages({
    'number.positive': 'Ma sanh phai lon hon 0'
  }),
  maThucDon: Joi.number().integer().positive().messages({
    'number.positive': 'Ma thuc don phai lon hon 0'
  }),
  tienDatCoc: Joi.number().precision(2).min(0).messages({
    'number.min': 'Tien dat coc phai lon hon hoac bang 0'
  }),
  soLuongBan: Joi.number().integer().positive().min(1).messages({
    'number.min': 'So luong ban phai lon hon 0'
  }),
  soBanDuTru: Joi.number().integer().min(0).messages({
    'number.min': 'So ban du tru phai lon hon hoac bang 0'
  })
}).min(1);

// Schema validation cho thêm dịch vụ vào đặt tiệc
export const addDichVuSchema = Joi.object({
  maDichVu: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma dich vu phai la so',
    'number.positive': 'Ma dich vu phai lon hon 0',
    'any.required': 'Ma dich vu la bat buoc'
  }),
  soLuong: Joi.number().integer().positive().min(1).required().messages({
    'number.base': 'So luong phai la so',
    'number.min': 'So luong phai lon hon 0',
    'any.required': 'So luong la bat buoc'
  }),
  donGiaThoiDiemDat: Joi.number().precision(2).positive().required().messages({
    'number.base': 'Don gia phai la so',
    'number.positive': 'Don gia phai lon hon 0',
    'any.required': 'Don gia la bat buoc'
  })
});

// Middleware validation
export const validateCreateDatTiec = (req, res, next) => {
  const { error } = createDatTiecSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateDatTiec = (req, res, next) => {
  const { error } = updateDatTiecSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateAddDichVu = (req, res, next) => {
  const { error } = addDichVuSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
