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
router.get(
  "/:transactionId",
  auth(UserRole.ADMIN),
  transactionController.getTransactionById
);

router.post(
  "/payout",
  auth(UserRole.RIDER),
  transactionController.createPayout
);

router.get(
  "/payout/all",
  auth(UserRole.ADMIN),
  transactionController.getPayouts
);

router.get(
  "/payout/:payoutId",
  auth(UserRole.ADMIN),
  transactionController.getPayout
);

router.get(
  "/driver-payout/:driverId",
  auth(),
  transactionController.getDriverPayouts
);

router.get(
  "/dashboard/overview",
  auth(UserRole.ADMIN),
  transactionController.getOverViewData
);

export const transactionRoutes = router;
