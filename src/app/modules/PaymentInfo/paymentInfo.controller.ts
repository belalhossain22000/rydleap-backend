import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { paymentInfoService } from "./paymentInfo.service";
import sendResponse from "../../../shared/sendResponse";

const paymentInfoCreate = catchAsync(async (req: any, res: Response) => {
  const userId = req.user?.id;
  const result = await paymentInfoService.createPaymentInfoIntoDB(
    req.body,
    userId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment info created successfully",
    data: result,
  });
});

const paymentInfoGetByUserId = catchAsync(async (req: any, res: Response) => {
  const userId = req.user?.id;
  const result = await paymentInfoService.getPaymentInfoByUserIdFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment info retrieved",
    data: result,
  });
});

export const paymentInfoController = {
  paymentInfoCreate,
  paymentInfoGetByUserId,
};
