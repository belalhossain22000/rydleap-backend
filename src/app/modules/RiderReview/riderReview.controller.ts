import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { RiderReviewService } from "./riderReview.service";

// create User
const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await RiderReviewService.createReview(req.body, user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully!",
    data: result,
  });
});
const getReviewsByRider = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await RiderReviewService.getReviewsByRider(user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review reterive successfully!",
    data: result,
  });
});

export const RiderReviewController = {
  createReview,
  getReviewsByRider,
};
