import httpStatus from "http-status";
import Stripe from "stripe";
import ApiError from "../../errors/ApiErrors";
import { isValidAmount } from "../../utils/isValidAmount";

// Initialize Stripe with your secret API key
const stripe = new Stripe(
  "sk_test_51QCahrGBTeINIOY6MsYzqwdfGrszZBRCaWqo2ESs9WJA4qvDK63IYcC9XK0vTDLN56tWQ83kqLntQBglvfJ0Clvr00Wp3KSygI",
  {
    apiVersion: "2024-06-20",
  }
);

// Service function for creating a PaymentIntent
const createPaymentIntentService = async (payload: {
  amount: number;
  paymentType: string;
}) => {
  if (!payload.amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Amount is required");
  }

  if (!isValidAmount(payload.amount)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Amount '${payload.amount}' is not a valid amount`
    );
  }

  // Create a PaymentIntent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: payload?.amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true, // Enable automatic payment methods like cards, Apple Pay, Google Pay
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  };
};

export const StripeServices = {
  createPaymentIntentService,
};
