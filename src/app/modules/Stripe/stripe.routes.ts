import express from "express";
import { StripeController } from "./stripe.controller";

const router = express.Router();

// payment from owner to rider
router.post("/create-payment-intent", StripeController.createPaymentIntent);

export const StripeRoutes = router;
