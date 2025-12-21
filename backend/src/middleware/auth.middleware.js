import jwt from 'jsonwebtoken';
import { errorResponse } from '../helpers/response.helper.js';
import logger from '../helpers/logger.js';

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('[AUTH] No token provided');
      return errorResponse(res, 'Unauthorized - No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gán thông tin user vào request
    req.user = decoded;
    
    logger.info(`[AUTH] User authenticated: ${decoded.username}`);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.error('[AUTH] Token expired');
      return errorResponse(res, 'Token đã hết hạn', 401);
    }
    
    if (error.name === 'JsonWebTokenError') {
      logger.error('[AUTH] Invalid token');
      return errorResponse(res, 'Token không hợp lệ', 401);
    }

    logger.error(`[AUTH] Error: ${error.message}`);
    return errorResponse(res, 'Unauthorized', 401);
  }
};

export default authMiddleware;