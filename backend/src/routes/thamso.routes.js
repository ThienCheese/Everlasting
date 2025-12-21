import { Router } from 'express';
import {
  getThamSo,
  updateThamSo
} from '../controller/thamso.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateThamSo } from '../middleware/validations/validateThamSo.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

router.get('/', getThamSo);
router.put('/update', authMiddleware, requireAdmin, validateThamSo, auditLogger('THAMSO_UPDATE'), updateThamSo);

export default router;
