import { Router } from "express";
import { revenueReport } from "../controllers/reportsController.js";

const router = Router();

router.get("/revenue", revenueReport);

export default router;
