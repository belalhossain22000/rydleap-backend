import express from "express";
import { invoiceControllers } from "./invoice.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/create", auth(UserRole.ADMIN), invoiceControllers.createInvoice);
router.get("/", auth(UserRole.ADMIN), invoiceControllers.getAllInvoices);
router.get("/:id", auth(UserRole.ADMIN), invoiceControllers.getInvoiceById);
router.get("/:id", auth(UserRole.ADMIN), invoiceControllers.updateInvoice);

export const invoiceRoute = router;
