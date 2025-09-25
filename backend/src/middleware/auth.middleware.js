import jwt from 'jsonwebtoken';
import { errorResponse } from '../helpers/response.helper.js';

const authMiddleware = (req,res,next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token){
        return errorResponse(res,'Unaithorized',401);
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (error){
        return errorResponse(res,'Unauthorized',401);
    }
}

export default authMiddleware;