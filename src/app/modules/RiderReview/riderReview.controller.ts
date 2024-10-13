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

const getAverageRatingByRiderId = catchAsync(
  async (req: Request, res: Response) => {
    const riderId = req.params.riderId;

    const result = await RiderReviewService.getAverageRatingByRiderIdFromDb(
      riderId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rider's Average Rating retrieved successfully!",
      data: result,
    });
  }
);

const updateReviewByCustomerId = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const result = await RiderReviewService.updateReviewById(
      req.body,
      user.id,
      req.params.reviewId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review Updated Successfully!",
      data: result,
    });
  }
);

const deleteReviewByCustomerId = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    await RiderReviewService.deleteReviewById(user.id, req.params.reviewId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review deleted successfully!",
      data: null,
    });
  }
);

export const RiderReviewController = {
  createReview,
  getReviewsByRider,
  updateReviewByCustomerId,
  deleteReviewByCustomerId,
  getAverageRatingByRiderId,
};
