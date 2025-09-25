import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getProducts, createProduct } from '../controller/products.controller.js'
//thieu import creater và get product

const router= express.Router();

router.get('/', getProducts);
router.post('/',authMiddleware, createProduct);

export default router;