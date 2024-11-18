import prisma from "../../../shared/prisma";

// const paypalPaymentToOwner = catchAsync(async (req: any, res: any) => {
//   const result: any = await paymentService.sendPaymentToOwner(req);

//   if (result && result.status === "CREATED") {
//     // Find the approval link from the response
//     const approvalLink = result.links.find(
//       (link: any) => link.rel === "approve"
//     );

//     if (approvalLink) {
//       const transactionInfo = await prisma.userTransaction.create({
//         data: {
//           userId: req.user.id,
//           riderId: req.body.riderId,
//           rideId: req.params.rideId,
//           amount: req.body.amount,
//           paymentMethod: "Paypal",
//           orderId: result.id,
//           url: approvalLink.href,
//         },
//       });
//       // Respond with the approval URL
//       sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "Payment created. Redirect the user to approve the payment.",
//         data: transactionInfo,
//       });
//     } else {
//       // Handle case where the approval link is not found
//       sendResponse(res, {
//         statusCode: 500,
//         success: false,
//         message: "Approval link not found in the payment response.",
//         data: null,
//       });
//     }
//   } else {
//     // Handle case where the order creation was unsuccessful
//     sendResponse(res, {
//       statusCode: 500,
//       success: false,
//       message: "Failed to create payment.",
//       data: result,
//     });
//   }
// });

type TTransactionPayload = {
  userId: string;
  riderId: string;
  rideId: string;
  amount: number;
  paymentMethod: string;
  orderId: string;
  url: string;
};

const createTransactionIntoDB = async (payload: TTransactionPayload) => {
  try {
    // 1. Check if rider exists and is a rider
    const rider = await prisma.user.findUnique({
      where: { id: payload.riderId },
    });
    if (!rider || rider.role !== "RIDER") {
      throw new Error("Rider not found or not a valid rider");
    }

    // 2. Check if ride exists
    const ride = await prisma.ride.findUnique({
      where: { id: payload.rideId },
    });
    if (!ride) {
      throw new Error("Ride not found");
    }

    // 3. Validate payment method (assuming you have a list of allowed payment methods)
    const allowedPaymentMethods = [
      "paypal",
      "card",
      "credit",
      "debit",
      "google pay",
      "apple pay",
    ];
    if (!allowedPaymentMethods.includes(payload.paymentMethod)) {
      throw new Error("Invalid payment method");
    }

    // If all checks pass, create the transaction
    const transactionInfo = await prisma.userTransaction.create({
      data: payload,
    });

    return transactionInfo;
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    throw new Error(error?.message);
  }
};

const getUserTransactionsFromDB = async () => {
  const result = await prisma.userTransaction.findMany();
  return result;
};

export const transactionService = {
  createTransactionIntoDB,
  getUserTransactionsFromDB,
};
