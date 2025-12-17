import { Router } from 'express';
import {
  getAllLoaiDichVu,
  getLoaiDichVu,
  createLoaiDichVu,
  updateLoaiDichVu,
  deleteLoaiDichVu,
} from '../controller/loaidichvu.controller.js';

const router = Router();

router.get('/lists', getAllLoaiDichVu);
router.get('/details/:id', getLoaiDichVu);
router.post('/create', createLoaiDichVu);
router.put('/update/:id', updateLoaiDichVu);
router.delete('/delete/:id', deleteLoaiDichVu);

export default router;
