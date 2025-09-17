import { Router } from "express";
import {
  getInvoices,
  createInvoice,
  markPaid,
} from "../controllers/invoicesController.js";

const router = Router();

router.get("/", getInvoices);
router.post("/", createInvoice);
router.put("/:id/pay", markPaid);

export default router;
