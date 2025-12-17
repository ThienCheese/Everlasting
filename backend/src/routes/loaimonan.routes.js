import { Router } from 'express';
import {
  getAllLoaiMonAn,
  getLoaiMonAn,
  createLoaiMonAn,
  updateLoaiMonAn,
  deleteLoaiMonAn,
} from '../controller/loaimonan.controller.js';

const router = Router();

router.get('/lists', getAllLoaiMonAn);
router.get('/details/:id', getLoaiMonAn);
router.post('/create', createLoaiMonAn);
router.put('/update/:id', updateLoaiMonAn);
router.delete('/delete/:id', deleteLoaiMonAn);

export default router;
