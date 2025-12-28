import { Router } from 'express';
import {
  getAllThucDon,
  getThucDon,
  createThucDon,
  createThucDonFromTemplate,
  updateThucDon,
  deleteThucDon,
  getMonAnThucDon,
  addMonAnThucDon,
  updateMonAnThucDon,
  removeMonAnThucDon
} from '../controller/thucdon.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateThucDon, validateCreateFromTemplate, validateUpdateThucDon, validateAddMonAn, validateUpdateMonAn } from '../middleware/validations/validateThucDon.js';
import { createLimiter, deleteLimiter, bookingLimiter } from '../middleware/ratelimit.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

// CRUD thực đơn
router.post('/create', authMiddleware, requirePermission('QUAN_LY_DAT_TIEC'), bookingLimiter, validateCreateThucDon, auditLogger('THUCDON_CREATE'), createThucDon);
router.post('/create-from-template', authMiddleware, requirePermission('QUAN_LY_DAT_TIEC'), createLimiter, validateCreateFromTemplate, auditLogger('THUCDON_CREATE_FROM_TEMPLATE'), createThucDonFromTemplate);
router.get('/lists', validatePagination, getAllThucDon);
router.get('/details/:id', validateIdParam('id'), getThucDon);
router.put('/update/:id', authMiddleware, requirePermission('QUAN_LY_DAT_TIEC'), validateIdParam('id'), validateUpdateThucDon, auditLogger('THUCDON_UPDATE'), updateThucDon);
router.delete('/delete/:id', authMiddleware, requirePermission('QUAN_LY_DAT_TIEC'), validateIdParam('id'), deleteLimiter, auditLogger('THUCDON_DELETE'), deleteThucDon);

// Quản lý món ăn trong thực đơn
router.get('/:id/monan', validateIdParam('id'), getMonAnThucDon);
router.post('/:id/monan', authMiddleware, requirePermission('QUAN_LY_DAT_TIEC'), bookingLimiter, validateIdParam('id'), validateAddMonAn, auditLogger('THUCDON_ADD_MONAN'), addMonAnThucDon);
router.put('/:id/monan/:maMonAn', authMiddleware, requirePermission('QUAN_LY_DAT_TIEC'), validateIdParam('id'), validateIdParam('maMonAn'), validateUpdateMonAn, auditLogger('THUCDON_UPDATE_MONAN'), updateMonAnThucDon);
router.delete('/:id/monan/:maMonAn', authMiddleware, requirePermission('QUAN_LY_DAT_TIEC'), validateIdParam('id'), validateIdParam('maMonAn'), deleteLimiter, auditLogger('THUCDON_REMOVE_MONAN'), removeMonAnThucDon);

export default router;
