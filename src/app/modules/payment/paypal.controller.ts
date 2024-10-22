import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { paymentService } from "./paypal.service";

const paypalPaymentToRider = catchAsync(async (req: any, res: any) => {
  const { email, amount } = req.body;
  const result = await paymentService.sendPaymentToRider(email, amount);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment successful",
    data: result,
  });
});

const paypalPaymentToOwner = catchAsync(async (req: any, res: any) => {
  const result: any = await paymentService.sendPaymentToOwner(req);

  console.log(result);

  if (result && result.status === "CREATED") {
    // Find the approval link from the response
    const approvalLink = result.links.find(
      (link: any) => link.rel === "approve"
    );

    if (approvalLink) {
      // Respond with the approval URL
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment created. Redirect the user to approve the payment.",
        data: {
          orderId: result.id,
          url: approvalLink.href,
        }, // Include the approval link in the response
      });
    } else {
      // Handle case where the approval link is not found
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Approval link not found in the payment response.",
        data: null,
      });
    }
  } else {
    // Handle case where the order creation was unsuccessful
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to create payment.",
      data: result,
    });
  }
});

const capturePayment = catchAsync(async (req: any, res: any) => {
  const { orderId } = req.query; // Get orderId from the query parameters

  if (!orderId) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Order ID is required.",
      data: null,
    });
  }

  try {
    const captureResult: any = await paymentService.capturePayment(orderId); // Capture the payment

    if (captureResult.status === "COMPLETED") {
      // Payment was successful
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message:
          "Payment successfully captured and amount transferred to owner.",
        data: captureResult,
      });
    } else {
      // Handle case where the payment was not completed
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Payment was not completed.",
        data: captureResult,
      });
    }
  } catch (error) {
    console.error("Error capturing payment:", error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "An error occurred during the payment capture.",
      data: null,
    });
  }
});

export const paypalController = {
  paypalPaymentToRider,
  paypalPaymentToOwner,
  capturePayment,
};
