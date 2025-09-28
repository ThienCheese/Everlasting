import express from 'express';
import productRoutes from './product.routes.js';
import sanhRoutes from './halls.route.js'

const router = express.Router();

router.use('/products', productRoutes);
router.use('/halls', sanhRoutes);
export default router;