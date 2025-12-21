import { Router } from 'express';
import {
  getAllPhanQuyen,
  getPhanQuyenByNhom,
  getPhanQuyenByChucNang,
  checkPermission,
  createPhanQuyen,
  deletePhanQuyen,
  updatePhanQuyenNhom
} from '../controller/phanquyen.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreatePhanQuyen, validateUpdatePhanQuyenNhom } from '../middleware/validations/validatePhanQuyen.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

// Tất cả endpoints yêu cầu Admin (MaNhom = 1)
router.get('/lists', authMiddleware, requireAdmin, validatePagination, getAllPhanQuyen);
router.get('/nhom/:maNhom', authMiddleware, requireAdmin, validateIdParam('maNhom'), getPhanQuyenByNhom);
router.get('/chucnang/:maChucNang', authMiddleware, requireAdmin, validateIdParam('maChucNang'), getPhanQuyenByChucNang);
router.get('/check/:maNhom/:maChucNang', authMiddleware, requireAdmin, validateIdParam('maNhom'), validateIdParam('maChucNang'), checkPermission);
router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreatePhanQuyen, auditLogger('PHANQUYEN_CREATE'), createPhanQuyen);
router.delete('/delete/:maNhom/:maChucNang', authMiddleware, requireAdmin, validateIdParam('maNhom'), validateIdParam('maChucNang'), deleteLimiter, auditLogger('PHANQUYEN_DELETE'), deletePhanQuyen);
router.put('/nhom/:maNhom', authMiddleware, requireAdmin, validateIdParam('maNhom'), validateUpdatePhanQuyenNhom, auditLogger('PHANQUYEN_UPDATE_NHOM'), updatePhanQuyenNhom);

export default router;
