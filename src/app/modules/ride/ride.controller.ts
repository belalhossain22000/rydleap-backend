import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { RideRequestService } from "./ride.service";

const createRideRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await RideRequestService.createRideRequest(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride request successfully created",
    data: result,
  });
});

const getRiderByRiderId = catchAsync(async (req: Request, res: Response) => {
  const rider = req.user as any;
  const result = await RideRequestService.getRideRequestsByRiderId(rider.iid);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending ride requests retrieved successfully",
    data: result,
  });
});

const getRideRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RideRequestService.getAllRideRequestsFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All ride requests retrieved successfully",
    data: result,
  });
});

export const RiderRequestController = {
  createRideRequest,
  getRiderByRiderId,
  getRideRequests,
};
