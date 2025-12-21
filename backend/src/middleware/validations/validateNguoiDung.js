import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho đăng ký
export const registerSchema = Joi.object({
  tenDangNhap: Joi.string().trim().alphanum().min(3).max(30).required().messages({
    'string.empty': 'Ten dang nhap khong duoc de trong',
    'string.alphanum': 'Ten dang nhap chi duoc chua chu va so',
    'string.min': 'Ten dang nhap phai co it nhat 3 ky tu',
    'string.max': 'Ten dang nhap khong duoc qua 30 ky tu',
    'any.required': 'Ten dang nhap la bat buoc'
  }),
  matKhau: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'Mat khau khong duoc de trong',
    'string.min': 'Mat khau phai co it nhat 6 ky tu',
    'string.max': 'Mat khau khong duoc qua 100 ky tu',
    'any.required': 'Mat khau la bat buoc'
  }),
  tenNguoiDung: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Ten nguoi dung khong duoc de trong',
    'string.min': 'Ten nguoi dung phai co it nhat 2 ky tu',
    'string.max': 'Ten nguoi dung khong duoc qua 100 ky tu',
    'any.required': 'Ten nguoi dung la bat buoc'
  }),
  maNhom: Joi.number().integer().positive().required().messages({
    'number.base': 'Ma nhom phai la so',
    'number.positive': 'Ma nhom phai lon hon 0',
    'any.required': 'Ma nhom la bat buoc'
  })
});

// Schema validation cho đăng nhập
export const loginSchema = Joi.object({
  tenDangNhap: Joi.string().required().messages({
    'string.empty': 'Ten dang nhap khong duoc de trong',
    'any.required': 'Ten dang nhap la bat buoc'
  }),
  matKhau: Joi.string().required().messages({
    'string.empty': 'Mat khau khong duoc de trong',
    'any.required': 'Mat khau la bat buoc'
  })
});

// Schema validation cho cập nhật user
export const updateUserSchema = Joi.object({
  tenNguoiDung: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten nguoi dung phai co it nhat 2 ky tu',
    'string.max': 'Ten nguoi dung khong duoc qua 100 ky tu'
  }),
  maNhom: Joi.number().integer().positive().messages({
    'number.positive': 'Ma nhom phai lon hon 0'
  }),
  matKhau: Joi.string().min(6).max(100).messages({
    'string.min': 'Mat khau phai co it nhat 6 ky tu',
    'string.max': 'Mat khau khong duoc qua 100 ky tu'
  })
}).min(1);

// Middleware validation
export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
