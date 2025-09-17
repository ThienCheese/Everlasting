import { Router } from "express";
import {
  getHalls,
  getHall,
  createHall,
  updateHall,
  deleteHall,
} from "../controllers/hallsController.js";

const router = Router();

router.get("/", getHalls);
router.get("/:id", getHall);
router.post("/", createHall);
router.put("/:id", updateHall);
router.delete("/:id", deleteHall);

export default router;
