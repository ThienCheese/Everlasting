import { Router } from 'express';
import {
  getAllBaoCao,
  getBaoCao,
  getBaoCaoByThangNam,
  createBaoCao,
  updateBaoCao,
  deleteBaoCao,
  getBaoCaoByNam
} from '../controller/baocaodoanhso.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateBaoCao, validateUpdateBaoCao } from '../middleware/validations/validateBaoCao.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

// CRUD báo cáo doanh số
router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateBaoCao, auditLogger('BAOCAO_CREATE'), createBaoCao);
router.get('/lists', authMiddleware, requireAdmin, validatePagination, getAllBaoCao);
router.get('/details/:id', authMiddleware, requireAdmin, validateIdParam('id'), getBaoCao);
router.get('/thang/:thang/nam/:nam', authMiddleware, requireAdmin, getBaoCaoByThangNam);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateBaoCao, auditLogger('BAOCAO_UPDATE'), updateBaoCao);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('BAOCAO_DELETE'), deleteBaoCao);

// Lọc báo cáo
router.get('/nam/:nam', authMiddleware, requireAdmin, getBaoCaoByNam);

export default router;
