import { Router } from 'express';
import {
  getAllDichVu,
  getDichVu,
  createDichVu,
  updateDichVu,
  deleteDichVu,
} from '../controller/dichvu.controller.js';

const router = Router();

router.get('/lists', getAllDichVu);
router.get('/details/:id', getDichVu);
router.post('/create', createDichVu);
router.put('/update/:id', updateDichVu);
router.delete('/delete/:id', deleteDichVu);

export default router;
