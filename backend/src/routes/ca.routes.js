import { Router } from 'express';
import {
  getAllCa,
  getCa,
  createCa,
  updateCa,
  deleteCa,
} from '../controller/ca.controller.js';

const router = Router();

router.get('/lists', getAllCa);
router.get('/details/:id', getCa);
router.post('/create', createCa);
router.put('/update/:id', updateCa);
router.delete('/delete/:id', deleteCa);

export default router;
