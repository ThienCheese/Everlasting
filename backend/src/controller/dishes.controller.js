import Dish from '../models/dishes.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';

export const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.getAll();
    return successResponse(res, dishes, "Dishes retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);
    if (!dish) return errorResponse(res, "Dish not found", 404);
    return successResponse(res, dish, "Dish retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createDish = async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    return successResponse(res, dish, "Dish created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.update(id, req.body);
    if (!dish) return errorResponse(res, "Dish not found", 404);
    return successResponse(res, dish, "Dish updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Dish.remove(id);
    if (!deleted) return errorResponse(res, "Dish not found", 404);
    return successResponse(res, null, "Dish deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
