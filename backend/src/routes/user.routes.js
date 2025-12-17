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
} from '../controller/users.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.get('/all', authMiddleware, getAllUsers); // Có thể thêm middleware admin
router.put('/update/:id', authMiddleware, updateUser);
router.delete('/delete/:id', authMiddleware, deleteUser);

export default router;