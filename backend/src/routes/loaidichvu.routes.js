import { Router } from 'express';
import {
  getAllLoaiDichVu,
  getLoaiDichVu,
  createLoaiDichVu,
  updateLoaiDichVu,
  deleteLoaiDichVu,
} from '../controller/loaidichvu.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateLoai, validateUpdateLoai } from '../middleware/validations/validateLoai.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.get('/lists', validatePagination, getAllLoaiDichVu);
router.get('/details/:id', validateIdParam('id'), getLoaiDichVu);
router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateLoai, auditLogger('LOAIDICHVU_CREATE'), createLoaiDichVu);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateLoai, auditLogger('LOAIDICHVU_UPDATE'), updateLoaiDichVu);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('LOAIDICHVU_DELETE'), deleteLoaiDichVu);

export default router;
