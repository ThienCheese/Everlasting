import { Router } from 'express';
import {
  getAllChucNang,
  getChucNang,
  createChucNang,
  updateChucNang,
  deleteChucNang
} from '../controller/chucnang.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateChucNang, validateUpdateChucNang } from '../middleware/validations/validateChucNang.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateChucNang, auditLogger('CHUCNANG_CREATE'), createChucNang);
router.get('/lists', authMiddleware, requireAdmin, validatePagination, getAllChucNang);
router.get('/details/:id', authMiddleware, requireAdmin, validateIdParam('id'), getChucNang);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateChucNang, auditLogger('CHUCNANG_UPDATE'), updateChucNang);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('CHUCNANG_DELETE'), deleteChucNang);

export default router;
