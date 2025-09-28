import { Router } from 'express';
import {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
} from '../controller/dishes.controller.js';

const router = Router();

router.post(
  '/create',
  createDish
);
router.get(
  '/lists',
  getDishes
);
router.get(
  '/details/:id',
  getDish
);
router.put(
  '/update/:id',
  updateDish
);
router.delete(
  '/delete/:id',
  deleteDish
);
export default router;