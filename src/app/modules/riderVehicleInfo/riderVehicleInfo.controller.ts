import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { VehicleInfoService } from "./riderVehicleInfo.service";
import sendResponse from "../../../shared/sendResponse";

const createRiderVehicleInfo = catchAsync(
  async (req: Request, res: Response) => {
    const result = await VehicleInfoService.createRiderVehicleInfoIntoDb(req);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Vehicle info created successfully",
      data: result,
    });
  }
);

export const RiderVehicleInfoController = {
  createRiderVehicleInfo,
};
