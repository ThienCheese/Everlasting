import { Router } from 'express';
import {
  getAllDichVu,
  getDichVu,
  createDichVu,
  updateDichVu,
  deleteDichVu,
} from '../controller/dichvu.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateDichVu, validateUpdateDichVu } from '../middleware/validations/validateDichVu.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';
import { PERMISSIONS } from '../services/permission.service.js';

const router = Router();

router.get('/lists', validatePagination, getAllDichVu);
router.get('/details/:id', validateIdParam('id'), getDichVu);
// Quản lý dịch vụ - MaChucNang = 4 (Admin, Quản lý)
router.post('/create', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SERVICE.id), createLimiter, validateCreateDichVu, auditLogger('DICHVU_CREATE'), createDichVu);
router.put('/update/:id', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SERVICE.id), validateIdParam('id'), validateUpdateDichVu, auditLogger('DICHVU_UPDATE'), updateDichVu);
router.delete('/delete/:id', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SERVICE.id), validateIdParam('id'), deleteLimiter, auditLogger('DICHVU_DELETE'), deleteDichVu);

export default router;
