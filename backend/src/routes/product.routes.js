import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getProducts, createProduct } from '../controller/products.controller.js'
import rbacMiddleware from '../middleware/rbac.middleware.js';
import validateProduct from '../middleware/validate.middleware.js';

const router= express.Router();

router.get('/', 
    authMiddleware,
    rbacMiddleware(['ADMIN', 'SUPPLIER_MANAGER']),//chi co admin va manager co the tao product
    validateProduct,
    getProducts);
router.post('/',authMiddleware, createProduct);

export default router;