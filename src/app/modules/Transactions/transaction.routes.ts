import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { transactionController } from "./transaction.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.RIDER),
  transactionController.createTransaction
);
router.get(
  "/",
  auth(UserRole.ADMIN),
  transactionController.getUserTransactions
);

export const transactionRoutes = router;
