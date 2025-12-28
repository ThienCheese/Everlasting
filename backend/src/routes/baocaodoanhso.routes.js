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

// CRUD báo cáo doanh số - Admin (1) và Kế toán (6) có quyền truy cập
const baoCaoPermission = [1, 6]; // QUAN_LY_NGUOI_DUNG hoặc QUAN_LY_HOA_DON

router.post('/create', authMiddleware, requirePermission(baoCaoPermission), createLimiter, validateCreateBaoCao, auditLogger('BAOCAO_CREATE'), createBaoCao);
router.get('/lists', authMiddleware, requirePermission(baoCaoPermission), validatePagination, getAllBaoCao);
router.get('/details/:id', authMiddleware, requirePermission(baoCaoPermission), validateIdParam('id'), getBaoCao);
router.get('/thang/:thang/nam/:nam', authMiddleware, requirePermission(baoCaoPermission), getBaoCaoByThangNam);
router.put('/update/:id', authMiddleware, requirePermission(baoCaoPermission), validateIdParam('id'), validateUpdateBaoCao, auditLogger('BAOCAO_UPDATE'), updateBaoCao);
router.delete('/delete/:id', authMiddleware, requirePermission(baoCaoPermission), validateIdParam('id'), deleteLimiter, auditLogger('BAOCAO_DELETE'), deleteBaoCao);

// Lọc báo cáo
router.get('/nam/:nam', authMiddleware, requirePermission(baoCaoPermission), getBaoCaoByNam);

export default router;
