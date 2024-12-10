import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { packageService } from "./package.service";

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await packageService.createPackageIntoDb(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Package created successfully",
    data: result,
  });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await packageService.getAllPackagesIntoDb();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All packages retrieved successfully",
    data: result,
  });
});

const getPackageById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await packageService.getPackageByIdIntoDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package fetched successfully",
    data: result,
  });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await packageService.updatePackageByIdIntoDb(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package Updated Successfully",
    data: result,
  });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await packageService.deletePackageByIdIntoDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package deleted successfully",
    data: null,
  });
});

export const packageController = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
