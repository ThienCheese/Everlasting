import Joi from 'joi';
import { errorResponse } from '../helpers/response.helper.js';

//Ham tao schema cho 1 object validate cac field can thiet
const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().precision(2).positive().required(),
  description: Joi.string().allow(null, ''),
  stock_quantity: Joi.number().integer().positive().min(0).required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return errorResponse(res, error.details[0].message, 400);
  }
  next();
};

export default validateProduct;
