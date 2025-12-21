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
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.get('/lists', validatePagination, getAllDichVu);
router.get('/details/:id', validateIdParam('id'), getDichVu);
router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateDichVu, auditLogger('DICHVU_CREATE'), createDichVu);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateDichVu, auditLogger('DICHVU_UPDATE'), updateDichVu);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('DICHVU_DELETE'), deleteDichVu);

export default router;
