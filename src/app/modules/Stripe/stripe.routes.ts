import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { StripeController } from "./stripe.controller";
import {
  AuthorizedPaymentPayloadSchema,
  capturedPaymentPayloadSchema,
  refundPaymentPayloadSchema,
  saveNewCardWithExistingCustomerPayloadSchema,
  TStripeSaveWithCustomerInfoPayloadSchema,
} from "./stripe.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

// create a new customer with card
router.post(
  "/save-card",
  auth(),
  validateRequest(TStripeSaveWithCustomerInfoPayloadSchema),
  StripeController.saveCardWithCustomerInfo
);

// Authorize the customer with the amount and send payment request
router.post(
  "/authorize-payment",
  validateRequest(AuthorizedPaymentPayloadSchema),
  StripeController.authorizedPaymentWithSaveCard
);

// Capture the payment request and deduct the amount
router.post(
  "/capture-payment",
  validateRequest(capturedPaymentPayloadSchema),
  StripeController.capturePaymentRequest
);

// Save new card to existing customer
router.post(
  "/save-new-card",
  validateRequest(saveNewCardWithExistingCustomerPayloadSchema),
  StripeController.saveNewCardWithExistingCustomer
);

// Get all save cards for customer
router.get("/get-cards/:customerId", StripeController.getCustomerSavedCards);

// Delete card from customer
router.delete(
  "/delete-card/:paymentMethodId",
  StripeController.deleteCardFromCustomer
);

// Refund payment to customer
router.post(
  "/refund-payment",
  validateRequest(refundPaymentPayloadSchema),
  StripeController.refundPaymentToCustomer
);

router.post("/create-payment-intent", StripeController.createPaymentIntent);

export const StripeRoutes = router;
