import { Router } from 'express';
import {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
} from '../controller/monan.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateDish, validateUpdateDish } from '../middleware/validations/validateMonAn.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.post('/create', authMiddleware, requireAdmin, createLimiter, validateCreateDish, auditLogger('DISH_CREATE'), createDish);
router.get('/lists', validatePagination, getDishes);
router.get('/details/:id', validateIdParam('id'), getDish);
router.put('/update/:id', authMiddleware, requireAdmin, validateIdParam('id'), validateUpdateDish, auditLogger('DISH_UPDATE'), updateDish);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('DISH_DELETE'), deleteDish);
export default router;