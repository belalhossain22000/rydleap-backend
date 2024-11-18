import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { paymentMethodService } from "./paymentMethod.service";
import sendResponse from "../../../shared/sendResponse";

//for login user
const createPaymentMethod = catchAsync(async (req: any, res: Response) => {
  const result = await paymentMethodService.createPaymentMethodIntoDB(
    req.body,
    req.user.id
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Payment Method Created Successfully",
    data: result,
  });
});

//for login user
const getAllPaymentMethods = catchAsync(async (req: any, res: Response) => {
  const result = await paymentMethodService.getPaymentMethodsByUserIdFromDB(
    req.user.id
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment Methods Retrieved Successfully",
    data: result,
  });
});

//for admin
const createMethod = catchAsync(async (req: any, res: Response) => {
  const userId = req.user.id;
  const result = await paymentMethodService.createMethod(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Payment Method Created Successfully",
    data: result,
  });
});

// get default payment methods
const getDefaultPaymentMethods = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentMethodService.getDefaultMethods();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Default Payment Methods Retrieved Successfully",
      data: result,
    });
  }
);

export const paymentMethodController = {
  createPaymentMethod,
  getAllPaymentMethods,
  createMethod,
  getDefaultPaymentMethods,
};
