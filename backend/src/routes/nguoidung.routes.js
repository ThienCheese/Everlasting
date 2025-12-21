import express from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controller/nguoidung.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin, validateUpdateUser } from '../middleware/validations/validateNguoiDung.js';
import { loginLimiter, createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';
import { validateIdParam } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', createLimiter, validateRegister, auditLogger('USER_REGISTER'), register);
router.post('/login', loginLimiter, validateLogin, auditLogger('USER_LOGIN'), login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', authMiddleware, auditLogger('USER_LOGOUT'), logout);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.get('/all', authMiddleware, requireAdmin, getAllUsers);
router.put('/update/:id', authMiddleware, validateIdParam('id'), validateUpdateUser, auditLogger('USER_UPDATE'), updateUser);
router.delete('/delete/:id', authMiddleware, requireAdmin, validateIdParam('id'), deleteLimiter, auditLogger('USER_DELETE'), deleteUser);

export default router;