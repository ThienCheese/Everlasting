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
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

// CRUD báo cáo doanh số
router.post('/create', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), createLimiter, validateCreateBaoCao, auditLogger('BAOCAO_CREATE'), createBaoCao);
router.get('/lists', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validatePagination, getAllBaoCao);
router.get('/details/:id', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('id'), getBaoCao);
router.get('/thang/:thang/nam/:nam', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), getBaoCaoByThangNam);
router.put('/update/:id', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('id'), validateUpdateBaoCao, auditLogger('BAOCAO_UPDATE'), updateBaoCao);
router.delete('/delete/:id', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), validateIdParam('id'), deleteLimiter, auditLogger('BAOCAO_DELETE'), deleteBaoCao);

// Lọc báo cáo
router.get('/nam/:nam', authMiddleware, requirePermission('QUAN_LY_NGUOI_DUNG'), getBaoCaoByNam);

export default router;
