import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { rydleapService } from "./rydleap.services";

// create Rydleap profile
const createRydleapProfile = catchAsync(async (req: Request, res: Response) => {
  const profileInfo = await rydleapService.createRydleapProfileIntoDB(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Rydleap Profile Created successfully",
    data: profileInfo,
  });
});

// get all rydleap profiles
const getRydleapProfiles = catchAsync(async (req: Request, res: Response) => {
  const profiles = await rydleapService.getProfileFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rydleap Profiles retrieved successfully",
    data: profiles,
  });
});

//update rydleap profile
const updateRydleapProfile = catchAsync(async (req: Request, res: Response) => {
  const profileId = req.params.id;
  const updateProfile = await rydleapService.updateRydleapProfileIntoDB(
    profileId,
    req
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rydleap Profile updated successfully",
    data: updateProfile,
  });
});

export const rydleapController = {
  createRydleapProfile,
  getRydleapProfiles,
  updateRydleapProfile,
};
