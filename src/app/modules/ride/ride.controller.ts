import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { RideRequestService } from "./ride.service";

const createRideRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await RideRequestService.createRideRequest(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride request successfully created",
    data: result,
  });
});

export const RiderRequestController = {
  createRideRequest,
};
