import Joi from 'joi';
import { errorResponse } from '../../helpers/response.helper.js';

// Schema validation cho tạo loại (loại món ăn, loại dịch vụ, loại sảnh)
export const createLoaiSchema = Joi.object({
  tenLoai: Joi.string().trim().min(2).max(100).messages({
    'string.empty': 'Ten loai khong duoc de trong',
    'string.min': 'Ten loai phai co it nhat 2 ky tu',
    'string.max': 'Ten loai khong duoc qua 100 ky tu',
    'any.required': 'Ten loai la bat buoc'
  }),
  tenLoaiSanh: Joi.string().trim().min(2).max(100).messages({
    'string.empty': 'Ten loai sanh khong duoc de trong',
    'string.min': 'Ten loai sanh phai co it nhat 2 ky tu',
    'string.max': 'Ten loai sanh khong duoc qua 100 ky tu',
    'any.required': 'Ten loai sanh la bat buoc'
  }),
  donGiaBanToiThieu: Joi.number().precision(2).positive().messages({
    'number.base': 'Don gia ban toi thieu phai la so',
    'number.positive': 'Don gia ban toi thieu phai lon hon 0'
  })
}).xor('tenLoai', 'tenLoaiSanh');

// Schema validation cho cập nhật loại
export const updateLoaiSchema = Joi.object({
  tenLoai: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten loai phai co it nhat 2 ky tu',
    'string.max': 'Ten loai khong duoc qua 100 ky tu'
  }),
  tenLoaiSanh: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Ten loai sanh phai co it nhat 2 ky tu',
    'string.max': 'Ten loai sanh khong duoc qua 100 ky tu'
  }),
  donGiaBanToiThieu: Joi.number().precision(2).positive().messages({
    'number.positive': 'Don gia ban toi thieu phai lon hon 0'
  })
}).min(1);

// Middleware validation
export const validateCreateLoai = (req, res, next) => {
  const { error } = createLoaiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};

export const validateUpdateLoai = (req, res, next) => {
  const { error } = updateLoaiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return errorResponse(res, errors.join(', '), 400);
  }
  next();
};
