import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { UserLocationService } from "./userLocation.service";

const createUserLocation = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const payload = {
    ...req.body,
    userId: user?.id,
  };

  const result = await UserLocationService.createUserLocationIntoDb(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Location created successfully!",
    data: result,
  });
});

const getUserLocation = catchAsync(async (req: Request, res: Response) => {
  const result = await UserLocationService.getUserLocationByIdIntoDb(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Location fetched successfully!",
    data: result,
  });
});

const updateUserLocation = catchAsync(async (req: Request, res: Response) => {
  const result = await UserLocationService.updateUserLocationByIdIntoDb(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Location updated successfully!",
    data: result,
  });
});

const deleteUserLocation = catchAsync(async (req: Request, res: Response) => {
  const result = await UserLocationService.deleteUserLocationByIdIntoDb(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Location deleted successfully!",
    data: result,
  });
});

export const UserLocationController = {
  createUserLocation,
  getUserLocation,
  updateUserLocation,
  deleteUserLocation,
};
