import { Router } from 'express';
import {
  getAllLoaiMonAn,
  getLoaiMonAn,
  createLoaiMonAn,
  updateLoaiMonAn,
  deleteLoaiMonAn,
} from '../controller/loaimonan.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateLoai, validateUpdateLoai } from '../middleware/validations/validateLoai.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.get('/lists', validatePagination, getAllLoaiMonAn);
router.get('/details/:id', validateIdParam('id'), getLoaiMonAn);
router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateLoai, auditLogger('LOAIMONAN_CREATE'), createLoaiMonAn);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateLoai, auditLogger('LOAIMONAN_UPDATE'), updateLoaiMonAn);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('LOAIMONAN_DELETE'), deleteLoaiMonAn);

export default router;
