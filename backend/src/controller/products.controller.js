import products from '../models/products.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';

export const getProducts = async (req, res) => {
  try {
    const product = await products.getAll();
    return successResponse(res, product, 'Products retrieved successfully', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await products.create(req.body);
    return successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};


