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
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.get('/lists', validatePagination, getAllLoaiDichVu);
router.get('/details/:id', validateIdParam('id'), getLoaiDichVu);
router.post('/create', authMiddleware, requirePermission('QUAN_LY_DICH_VU'), createLimiter, validateCreateLoai, auditLogger('LOAIDICHVU_CREATE'), createLoaiDichVu);
router.put('/update/:id', authMiddleware, requirePermission('QUAN_LY_DICH_VU'), validateIdParam('id'), validateUpdateLoai, auditLogger('LOAIDICHVU_UPDATE'), updateLoaiDichVu);
router.delete('/delete/:id', authMiddleware, requirePermission('QUAN_LY_DICH_VU'), validateIdParam('id'), deleteLimiter, auditLogger('LOAIDICHVU_DELETE'), deleteLoaiDichVu);

export default router;
