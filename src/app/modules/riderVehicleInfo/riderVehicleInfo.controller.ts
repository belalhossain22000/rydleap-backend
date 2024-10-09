import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { VehicleInfoService } from "./riderVehicleInfo.service";
import sendResponse from "../../../shared/sendResponse";

const createRiderVehicleInfo = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const result = await VehicleInfoService.createRiderVehicleInfoIntoDb(
      req,
      user
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Vehicle info created successfully",
      data: result,
    });
  }
);
const getRiderVehicleInfo = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await VehicleInfoService.getRiderVehicleInfoFromDb(req, user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vehicle info reterived successfully",
    data: result,
  });
});
const updateRiderVehicleInfo = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await VehicleInfoService.updateRiderVehicleInfoInDb(req, user);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vehicle info reterived successfully",
    data: result,
  });
});
const deleteRiderVehicleInfo = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    const result = await VehicleInfoService.deleteRiderVehicleInfoFromDb(user.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Vehicle info reterived successfully",
      data: result,
    });
  }
);

export const RiderVehicleInfoController = {
  createRiderVehicleInfo,
  getRiderVehicleInfo,
  deleteRiderVehicleInfo,
  updateRiderVehicleInfo
};
