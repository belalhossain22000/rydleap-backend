import express from "express";
import { paypalController } from "./paypal.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

//payment from owner to rider
router.post(
  "/paypal-payment-rider",
  auth("ADMIN"),
  paypalController.paypalPaymentToRider
);

//payment order created by user
router.post("/paypal-payment-owner", paypalController.paypalPaymentToOwner);

//capture payment from user by order id
router.post("/paypal-capture-payment", paypalController.capturePayment);

export const paymentRoutes = router;
