import express from 'express';
import hallRoutes from './sanh.routes.js';
import dishRoutes from './monan.routes.js';
import loaiMonAnRoutes from './loaimonan.routes.js';
import dichVuRoutes from './dichvu.routes.js';
import loaiDichVuRoutes from './loaidichvu.routes.js';
import caRoutes from './ca.routes.js';
import userRoutes from './nguoidung.routes.js';
import thucDonRoutes from './thucdon.routes.js';
import thucDonMauRoutes from './thucdonmau.routes.js';
import datTiecRoutes from './dattiec.routes.js';
import hoaDonRoutes from './hoadon.routes.js';
import baoCaoDoanhSoRoutes from './baocaodoanhso.routes.js';
import thamSoRoutes from './thamso.routes.js';
import chucNangRoutes from './chucnang.routes.js';
import phanQuyenRoutes from './phanquyen.routes.js';

const router = express.Router();

router.use('/sanh', hallRoutes);
router.use('/monan', dishRoutes);
router.use('/loaimonan', loaiMonAnRoutes);
router.use('/dichvu', dichVuRoutes);
router.use('/loaidichvu', loaiDichVuRoutes);
router.use('/ca', caRoutes);
router.use('/nguoidung', userRoutes);
router.use('/thucdon', thucDonRoutes);
router.use('/thucdonmau', thucDonMauRoutes);
router.use('/dattiec', datTiecRoutes);
router.use('/hoadon', hoaDonRoutes);
router.use('/baocaodoanhso', baoCaoDoanhSoRoutes);
router.use('/thamso', thamSoRoutes);
router.use('/chucnang', chucNangRoutes);
router.use('/phanquyen', phanQuyenRoutes);

export default router;