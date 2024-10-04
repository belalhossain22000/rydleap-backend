import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SendOptService } from "./otp.service";

const sendOtpMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await SendOptService.sendOtpMessage(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent successfully",
    data: result,
  });
});
const verifyOtpMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await SendOptService.verifyOtpMessage(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully. Proceed to registration.",
    data: result,
  });
});

export const SendOptController = {
  sendOtpMessage,
  verifyOtpMessage
};
