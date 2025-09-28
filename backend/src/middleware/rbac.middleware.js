import { errorResponse } from "../helpers/response.helper.js";
import logger from "../helpers/logger.js";

const rbacMiddleware = (roles) => {
    return (req,res,next) => {
        logger.info(`Registered user roles: ${req.user.role}`);
        if (roles.includes(req.user.role)){
            next();
        }
        else return errorResponse(res, 'You do not have permission to access this resource',401);
    };
};

export default rbacMiddleware;