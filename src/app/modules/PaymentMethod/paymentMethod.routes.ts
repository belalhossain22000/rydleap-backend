import express from "express";
import auth from "../../middlewares/auth";
import { paymentMethodController } from "./paymentMethod.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/create", auth(), paymentMethodController.createPaymentMethod);
router.get("/", auth(), paymentMethodController.getAllPaymentMethods);
router.post("/", auth(UserRole.ADMIN), paymentMethodController.createMethod);
router.get(
  "/default",
  auth(),
  paymentMethodController.getDefaultPaymentMethods
);

export const paymentMethodRoute = router;
