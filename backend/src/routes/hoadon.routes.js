import { Router } from 'express';
import {
  getAllHoaDon,
  getHoaDon,
  getHoaDonByDatTiec,
  createHoaDon,
  updateHoaDon,
  updateTrangThaiHoaDon,
  deleteHoaDon,
  getHoaDonByMonth,
  getHoaDonByTrangThai
} from '../controller/hoadon.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateHoaDon, validateUpdateHoaDon, validateUpdateTrangThai } from '../middleware/validations/validateHoaDon.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

// CRUD hóa đơn
router.post('/create', authMiddleware, createLimiter, validateCreateHoaDon, auditLogger('HOADON_CREATE'), createHoaDon);
router.get('/lists', authMiddleware, validatePagination, getAllHoaDon);
router.get('/details/:id', authMiddleware, validateIdParam('id'), getHoaDon);
router.get('/dattiec/:maDatTiec', authMiddleware, validateIdParam('maDatTiec'), getHoaDonByDatTiec);
router.put('/update/:id', authMiddleware, validateIdParam('id'), validateUpdateHoaDon, auditLogger('HOADON_UPDATE'), updateHoaDon);
router.delete('/delete/:id', authMiddleware, requirePermission('QUAN_LY_HOA_DON'), validateIdParam('id'), deleteLimiter, auditLogger('HOADON_DELETE'), deleteHoaDon);

// Cập nhật trạng thái
router.put('/:id/trangthai', authMiddleware, validateIdParam('id'), validateUpdateTrangThai, auditLogger('HOADON_UPDATE_STATUS'), updateTrangThaiHoaDon);

// Lọc hóa đơn
router.get('/month/:thang/:nam', authMiddleware, getHoaDonByMonth);
router.get('/trangthai/:trangThai', authMiddleware, getHoaDonByTrangThai);

export default router;
