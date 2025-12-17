import express from 'express';
import productRoutes from './product.routes.js';
import hallRoutes from './halls.route.js';
import dishRoutes from './dishes.routes.js';
import loaiMonAnRoutes from './loaimonan.routes.js';
import dichVuRoutes from './dichvu.routes.js';
import loaiDichVuRoutes from './loaidichvu.routes.js';
import caRoutes from './ca.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/halls', hallRoutes);
router.use('/dishes', dishRoutes);
router.use('/loaimonan', loaiMonAnRoutes);
router.use('/dichvu', dichVuRoutes);
router.use('/loaidichvu', loaiDichVuRoutes);
router.use('/ca', caRoutes);
router.use('/users', userRoutes);

export default router;