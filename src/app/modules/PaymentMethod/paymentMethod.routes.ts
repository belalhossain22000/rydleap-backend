import express from "express";
import auth from "../../middlewares/auth";
import { paymentMethodController } from "./paymentMethod.controller";

const router = express.Router();

router.post("/create", auth(), paymentMethodController.createPaymentMethod);
router.post("/", auth(), paymentMethodController.getAllPaymentMethods);

export const paymentMethodRoute = router;
