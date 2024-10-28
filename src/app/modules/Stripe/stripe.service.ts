import httpStatus from "http-status";
import Stripe from "stripe";
import config from "../../../config";
import ApiError from "../../errors/ApiErrors";
import { isValidAmount } from "../../utils/isValidAmount";
import { TStripeSaveWithCustomerInfo } from "./stripe.interface";

// Initialize Stripe with your secret API key
const stripe = new Stripe(config.stripe_key as string, {
  apiVersion: "2024-06-20",
});

// Step 1: Create a Customer and Save the Card
const saveCardWithCustomerInfoIntoStripe = async (
  payload: TStripeSaveWithCustomerInfo
) => {
  try {
    const { user, paymentMethodId, address } = payload;

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name: user.name,
      email: user.email,
      address: {
        city: address.city,
        postal_code: address.postal_code,
        country: address.country,
      },
    });

    // Attach PaymentMethod to the Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set PaymentMethod as Default
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return {
      customerId: customer.id,
      paymentMethodId: paymentMethodId,
    };
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// Step 2: Authorize the Payment Using Saved Card
const authorizedPaymentWithSaveCardFromStripe = async (payload: {
  customerId: string;
  amount: number;
  paymentMethodId: string;
}) => {
  try {
    const { customerId, amount, paymentMethodId } = payload;

    if (!isValidAmount(amount)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Amount '${amount}' is not a valid amount`
      );
    }

    // Create a PaymentIntent with the specified PaymentMethod
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      capture_method: "manual", // Authorize the payment without capturing
    });

    return paymentIntent;
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// Step 3: Capture the Payment
const capturePaymentRequestToStripe = async (payload: {
  paymentIntentId: string;
}) => {
  try {
    const { paymentIntentId } = payload;

    // Capture the authorized payment using the PaymentIntent ID
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

    return paymentIntent;
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// New Route: Save a New Card for Existing Customer
const saveNewCardWithExistingCustomerIntoStripe = async (payload: {
  customerId: string;
  paymentMethodId: string;
}) => {
  try {
    const { customerId, paymentMethodId } = payload;

    // Attach the new PaymentMethod to the existing Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Optionally, set the new PaymentMethod as the default
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return {
      customerId: customerId,
      paymentMethodId: paymentMethodId,
    };
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getCustomerSavedCardsFromStripe = async (customerId: string) => {
  try {
    // List all payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    return { paymentMethods: paymentMethods.data };
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// Delete a card from a customer in the stripe
const deleteCardFromCustomer = async (paymentMethodId: string) => {
  try {
    await stripe.paymentMethods.detach(paymentMethodId);
    return { message: "Card deleted successfully" };
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// Refund amount to customer in the stripe
const refundPaymentToCustomer = async (payload: {
  paymentIntentId: string;
}) => {
  try {
    // Refund the payment intent
    const refund = await stripe.refunds.create({
      payment_intent: payload?.paymentIntentId,
    });

    return refund;
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// Service function for creating a PaymentIntent
const createPaymentIntentService = async (payload: { amount: number }) => {
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
  saveCardWithCustomerInfoIntoStripe,
  authorizedPaymentWithSaveCardFromStripe,
  capturePaymentRequestToStripe,
  saveNewCardWithExistingCustomerIntoStripe,
  getCustomerSavedCardsFromStripe,
  deleteCardFromCustomer,
  refundPaymentToCustomer,
  createPaymentIntentService,
};
