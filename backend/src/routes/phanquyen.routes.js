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
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

// Tất cả endpoints yêu cầu Admin (MaNhom = 1)
router.get('/lists', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validatePagination, getAllPhanQuyen);
router.get('/nhom/:maNhom', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('maNhom'), getPhanQuyenByNhom);
router.get('/chucnang/:maChucNang', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('maChucNang'), getPhanQuyenByChucNang);
router.get('/check/:maNhom/:maChucNang', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('maNhom'), validateIdParam('maChucNang'), checkPermission);
router.post('/create', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), createLimiter, validateCreatePhanQuyen, auditLogger('PHANQUYEN_CREATE'), createPhanQuyen);
router.delete('/delete/:maNhom/:maChucNang', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('maNhom'), validateIdParam('maChucNang'), deleteLimiter, auditLogger('PHANQUYEN_DELETE'), deletePhanQuyen);
router.put('/nhom/:maNhom', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('maNhom'), validateUpdatePhanQuyenNhom, auditLogger('PHANQUYEN_UPDATE_NHOM'), updatePhanQuyenNhom);

export default router;
