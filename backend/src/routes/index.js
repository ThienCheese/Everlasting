import express from 'express';
import productRoutes from './product.routes.js';
import hallRoutes from './halls.route.js'
import dishRoutes from './dishes.routes.js'

const router = express.Router();

router.use('/products', productRoutes);
router.use('/halls', hallRoutes);
router.use('/dishes', dishRoutes);
export default router;