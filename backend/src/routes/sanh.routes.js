import { Router } from 'express';
import {
  getHalls,
  getHall,
  createHall,
  updateHall,
  deleteHall,
} from '../controller/sanh.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateHall, validateUpdateHall } from '../middleware/validations/validateSanh.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateHall, auditLogger('HALL_CREATE'), createHall);
router.get('/lists', validatePagination, getHalls);
router.get('/details/:id', validateIdParam('id'), getHall);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateHall, auditLogger('HALL_UPDATE'), updateHall);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('HALL_DELETE'), deleteHall);

export default router;
