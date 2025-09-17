import { Router } from "express";
import {
  getRules,
  updateRule,
} from "../controllers/rulesController.js";

const router = Router();

router.get("/", getRules);
router.post("/", updateRule);

export default router;
