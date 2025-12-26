import logger from "../helpers/logger.js";
import { errorResponse } from "../helpers/response.helper.js";

const errorHandler = (err, req, res, next) => {
    logger.error(`[ERROR] ${err.message}`,err);
    //gia tri mac dinh
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    //xu li loi
    if(err.name === 'ValidationError'){
        statusCode = 400;
        message = err.detail?.map(d=>d.message).join(', ') || 'Validation Error';
    }
    else if(err.name === 'JsonWebTokenError'){
        statusCode=401;
        message = 'Unauthorized';
    }
    else if(err.name ==='TokenExpiredError'){
        statusCode = 401;
        message = 'Token Expired';
    }
    else if(err.code === '23505'){
        statusCode = 400;
        message = 'Duplicate Key';
    }
    return errorResponse(res, message, statusCode);
};
export default errorHandler;