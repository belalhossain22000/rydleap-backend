import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { paymentMethodService } from "./paymentMethod.service";
import sendResponse from "../../../shared/sendResponse";

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

export const paymentMethodController = {
  createPaymentMethod,
  getAllPaymentMethods,
};
