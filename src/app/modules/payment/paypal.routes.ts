import express from "express";
import { paypalController } from "./paypal.controller";

const router = express.Router();

router.post("/paypal-payment-rider", paypalController.paypalPaymentToRider);
router.post("/paypal-payment-owner", paypalController.paypalPaymentToOwner);
router.post("/paypal-capture-payment", paypalController.capturePayment);

export const paymentRoutes = router;
