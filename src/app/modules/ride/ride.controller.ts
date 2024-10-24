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
  const result = await RideRequestService.getRideRequestsByRiderId(rider.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending ride requests retrieved successfully",
    data: result,
  });
});

const getRiderByUserId = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await RideRequestService.getRideRequestsByUserId(user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending ride requests retrieved successfully",
    data: result,
  });
});

const getRideHistoryByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const result = await RideRequestService.getRideHistoryByUserId(user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User ride history retrieved successfully",
      data: result,
    });
  }
);

const getRideHistoryByRiderId = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const result = await RideRequestService.getRideHistoryByRiderId(user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rider ride history  retrieved successfully",
      data: result,
    });
  }
);

const getRideRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RideRequestService.getAllRideRequestsFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All ride requests retrieved successfully",
    data: result,
  });
});

//view ride request info when see the ride request
const getRideRequest = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.rideId;
  const result = await RideRequestService.getRideRequestByRideId(rideId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride request info retrieved successfully",
    data: result,
  });
});

const updateRideRequestByRideId = catchAsync(
  async (req: Request, res: Response) => {
    const rideId = req.params.rideId;
    const result = await RideRequestService.updateRideStatusByRideId(
      req,
      rideId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ride status updated successfully",
      data: result,
    });
  }
);

export const RiderRequestController = {
  createRideRequest,
  getRiderByRiderId,
  getRideRequests,
  getRiderByUserId,
  updateRideRequestByRideId,
  getRideHistoryByRiderId,
  getRideHistoryByUserId,
  getRideRequest,
};
