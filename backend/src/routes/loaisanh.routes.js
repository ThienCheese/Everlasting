import { Router } from 'express';
import {
  getAllLoaiSanh,
  getLoaiSanh,
  createLoaiSanh,
  updateLoaiSanh,
  deleteLoaiSanh,
} from '../controller/loaisanh.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateLoai, validateUpdateLoai } from '../middleware/validations/validateLoai.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.get('/lists', validatePagination, getAllLoaiSanh);
router.get('/details/:id', validateIdParam('id'), getLoaiSanh);
router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateLoai, auditLogger('LOAISANH_CREATE'), createLoaiSanh);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateLoai, auditLogger('LOAISANH_UPDATE'), updateLoaiSanh);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('LOAISANH_DELETE'), deleteLoaiSanh);

export default router;
