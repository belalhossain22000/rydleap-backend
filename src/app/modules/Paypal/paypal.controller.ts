import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../errors/ApiErrors";
import { paymentService } from "./paypal.service";

//payment from owner to rider
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

//payment order created by user
const paypalPaymentToOwner = catchAsync(async (req: any, res: any) => {
  const result: any = await paymentService.sendPaymentToOwner(req);

  if (result && result.status === "CREATED") {
    // Find the approval link from the response
    const approvalLink = result.links.find(
      (link: any) => link.rel === "approve"
    );

    if (approvalLink) {
      const transactionInfo = await prisma.userTransaction.create({
        data: {
          userId: req.user.id,
          riderId: req.body.riderId,
          rideId: req.params.rideId,
          amount: req.body.amount,
          paymentMethod: "Paypal",
          orderId: result.id,
          url: approvalLink.href,
        },
      });
      // Respond with the approval URL
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment created. Redirect the user to approve the payment.",
        data: transactionInfo,
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

//capture payment from user by order id
const capturePayment = catchAsync(async (req: any, res: any) => {
  const { orderId, riderId, rideId } = req.body; // Get orderId from the query parameters

  if (!orderId) {
    throw new ApiError(404, "Order not found");
  }

  try {
    const captureResult: any = await paymentService.capturePayment(orderId); // Capture the payment
    console.log(captureResult);

    if (captureResult.status === "COMPLETED") {
      await prisma.userTransaction.updateMany({
        where: { orderId: captureResult.id },
        data: {
          status: captureResult.status,
        },
      });

      //update rider isAvailable
      await prisma.user.update({
        where: { id: riderId },
        data: {
          isAvailable: true,
        },
      });

      //update ride status to completed
      await prisma.ride.update({
        where: { id: rideId },
        data: {
          status: "COMPLETED",
        },
      });

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
