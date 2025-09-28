import logger from './logger.js';

export const successResponse = (res, data = null, message, statusCode = 200) => {
    logger.info(`[SUCCESS]${message}`);
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

export const errorResponse = (res, message, statusCode = 500) => {
    logger.error(`[ERROR] ${message}`);
    return res.status(statusCode).json({
        status: 'error',
        message,
    });
};

// //cach dung trong controller
// import { successResponse, errorResponse } from '../helpers/response.helper.js';

// app.get('/test', (req, res) => {
//     try {
//         successResponse(res, { id: 1 }, "Lấy dữ liệu thành công");
//     } catch (err) {
//         errorResponse(res, "Có lỗi xảy ra");
//     }
// });
