// controllers/hall.controller.js
import Hall from '../models/halls.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';

export const getHalls = async (req, res) => {
  try {
    const halls = await Hall.getAll();
    return successResponse(res, halls, 'Halls retrieved successfully', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getHall = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return errorResponse(res, 'Hall not found', 404);
    }
    return successResponse(res, hall, 'Hall retrieved successfully', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createHall = async (req, res) => {
  try {
    const hall = await Hall.create(req.body);
    return successResponse(res, hall, 'Hall created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateHall = async (req, res) => {
  try {
    const hall = await Hall.update(req.params.id, req.body);
    if (!hall) {
      return errorResponse(res, 'Hall not found', 404);
    }
    return successResponse(res, hall, 'Hall updated successfully', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteHall = async (req, res) => {
  try {
    const deleted = await Hall.remove(req.params.id);
    if (!deleted) {
      return errorResponse(res, 'Hall not found', 404);
    }
    return successResponse(res, { id: deleted }, 'Hall deleted successfully', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
