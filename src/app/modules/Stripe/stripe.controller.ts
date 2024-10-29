import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StripeServices } from "./stripe.service";

// create a new customer with card
const saveCardWithCustomerInfo = catchAsync(async (req: any, res: any) => {
  const userId = req.user.id;
  const result = await StripeServices.saveCardWithCustomerInfoIntoStripe(
    req.body,
    userId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Create customer and save card successfully",
    data: result,
  });
});

// Authorize the customer with the amount and send payment request
const authorizedPaymentWithSaveCard = catchAsync(async (req: any, res: any) => {
  const result = await StripeServices.authorizedPaymentWithSaveCardFromStripe(
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Authorized customer and payment request successfully",
    data: result,
  });
});

// Capture the payment request and deduct the amount
const capturePaymentRequest = catchAsync(async (req: any, res: any) => {
  const result = await StripeServices.capturePaymentRequestToStripe(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Capture payment request and payment deduct successfully",
    data: result,
  });
});

// Save new card to existing customer
const saveNewCardWithExistingCustomer = catchAsync(
  async (req: any, res: any) => {
    const result =
      await StripeServices.saveNewCardWithExistingCustomerIntoStripe(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "New card save successfully",
      data: result,
    });
  }
);

// Get all save cards for customer
const getCustomerSavedCards = catchAsync(async (req: any, res: any) => {
  const result = await StripeServices.getCustomerSavedCardsFromStripe(
    req?.params?.customerId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Retrieve customer cards successfully",
    data: result,
  });
});

// Delete card from customer
const deleteCardFromCustomer = catchAsync(async (req: any, res: any) => {
  const result = await StripeServices.deleteCardFromCustomer(
    req.params?.paymentMethodId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete a card successfully",
    data: result,
  });
});

// Refund payment to customer
const refundPaymentToCustomer = catchAsync(async (req: any, res: any) => {
  const result = await StripeServices.refundPaymentToCustomer(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Refund payment successfully",
    data: result,
  });
});

//payment from owner to rider
const createPaymentIntent = catchAsync(async (req: any, res: any) => {
  const result = await StripeServices.createPaymentIntentService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stipe payment successful",
    data: result,
  });
});

export const StripeController = {
  saveCardWithCustomerInfo,
  authorizedPaymentWithSaveCard,
  capturePaymentRequest,
  saveNewCardWithExistingCustomer,
  getCustomerSavedCards,
  deleteCardFromCustomer,
  refundPaymentToCustomer,
  createPaymentIntent,
};
