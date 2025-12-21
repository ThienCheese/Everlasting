import { Router } from 'express';
import {
  getAllCa,
  getCa,
  createCa,
  updateCa,
  deleteCa,
} from '../controller/ca.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateCa, validateUpdateCa } from '../middleware/validations/validateCa.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.get('/lists', validatePagination, getAllCa);
router.get('/details/:id', validateIdParam('id'), getCa);
router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateCa, auditLogger('CA_CREATE'), createCa);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateCa, auditLogger('CA_UPDATE'), updateCa);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('CA_DELETE'), deleteCa);

export default router;
