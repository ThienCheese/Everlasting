import { Router } from "express";
import {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
} from "../controllers/dishesController.js";

const router = Router();

router.get("/", getDishes);
router.get("/:id", getDish);
router.post("/", createDish);
router.put("/:id", updateDish);
router.delete("/:id", deleteDish);

export default router;
