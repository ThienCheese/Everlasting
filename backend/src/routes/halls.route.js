import { Router } from 'express';
import {
  getHalls,
  getHall,
  createHall,
  updateHall,
  deleteHall,
} from "../controller/halls.controller.js";

const router = Router();

router.post(
  '/create',
  createHall
);
router.get(
  '/lists',
  getHalls
);
router.get(
  '/details/:id',
  getHall
);
router.put(
  '/update/:id',
  updateHall
);
router.delete(
  '/delete/:id',
  deleteHall
);

export default router;
