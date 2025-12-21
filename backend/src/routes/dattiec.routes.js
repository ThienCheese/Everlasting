import { Router } from 'express';
import {
  getAllDatTiec,
  getDatTiec,
  createDatTiec,
  updateDatTiec,
  cancelDatTiec,
  getDichVuDatTiec,
  addDichVuDatTiec,
  updateDichVuDatTiec,
  removeDichVuDatTiec,
  getDatTiecByDate,
  getDatTiecByMonth
} from '../controller/dattiec.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateDatTiec, validateUpdateDatTiec, validateAddDichVu } from '../middleware/validations/validateDatTiec.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Quản lý đặt tiệc - MaChucNang = 5 (Admin, Lễ tân, Quản lý, Bếp trưởng, Kế toán)
// CRUD đặt tiệc
router.post('/create', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), createLimiter, validateCreateDatTiec, auditLogger('DATTIEC_CREATE'), createDatTiec);
router.get('/lists', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validatePagination, getAllDatTiec);
router.get('/details/:id', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validateIdParam('id'), getDatTiec);
router.put('/update/:id', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validateIdParam('id'), validateUpdateDatTiec, auditLogger('DATTIEC_UPDATE'), updateDatTiec);
router.put('/cancel/:id', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validateIdParam('id'), auditLogger('DATTIEC_CANCEL'), cancelDatTiec);

// Quản lý dịch vụ trong đặt tiệc
router.get('/:id/dichvu', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validateIdParam('id'), getDichVuDatTiec);
router.post('/:id/dichvu', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validateIdParam('id'), validateAddDichVu, auditLogger('DATTIEC_ADD_DICHVU'), addDichVuDatTiec);
router.put('/:id/dichvu/:maDichVu', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validateIdParam('id'), validateIdParam('maDichVu'), auditLogger('DATTIEC_UPDATE_DICHVU'), updateDichVuDatTiec);
router.delete('/:id/dichvu/:maDichVu', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), validateIdParam('id'), validateIdParam('maDichVu'), deleteLimiter, auditLogger('DATTIEC_REMOVE_DICHVU'), removeDichVuDatTiec);

// Lấy đặt tiệc theo thời gian
router.get('/date/:ngay', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), getDatTiecByDate);
router.get('/month/:thang/:nam', authMiddleware, requirePermission(PERMISSIONS.MANAGE_BOOKING.id), getDatTiecByMonth);

export default router;
