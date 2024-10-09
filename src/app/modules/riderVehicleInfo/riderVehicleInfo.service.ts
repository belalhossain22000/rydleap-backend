import { Request } from "express";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { ObjectId } from "mongodb";

// create vehivle information
const createRiderVehicleInfoIntoDb = async (req: Request, user: any) => {
  const files = req.files as any;
  console.log(files);

  if (
    !files.vehicleRegistrationImage &&
    !files.vehicleInsuranceImage &&
    !files.drivingLicenceImage
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, "No files uploaded");
  }

  const vehicleInfo = JSON.parse(req.body.body);

  const rider = await prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!rider) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
  }

  const vehicleRegistrationImage = files?.vehicleRegistrationImage?.map(
    (file: any) => ({
      url: `${config.backend_base_url}/uploads/${file.originalname}`,
    })
  );

  const vehicleInsuranceImage = files.vehicleInsuranceImage.map(
    (file: any) => ({
      url: `${config.backend_base_url}/uploads/${file.originalname}`,
    })
  );
  const drivingLicenceImage = files.vehicleInsuranceImage.map((file: any) => ({
    url: `${config.backend_base_url}/uploads/${file.originalname}`,
  }));
  const vehicleInfoImages = {
    vehicleRegistrationImage,
    vehicleInsuranceImage,
    drivingLicenceImage,
  };

  const vehicleInfoData = {
    ...vehicleInfo,
    ...vehicleInfoImages,
  };
  const result = await prisma.riderVehicleInfo.create({
    data: { ...vehicleInfoData, userId: user.id },
  });
  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create vehicle info"
    );
  }
  return result;
};

// get vehicle info by rider /user id
const getRiderVehicleInfoFromDb = async (req: Request, user: any) => {
  const rider = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!rider) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
  }

  const vehicleInfo = await prisma.riderVehicleInfo.findFirst({
    where: { userId: user.id },
  });

  if (!vehicleInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle information not found");
  }

  return vehicleInfo;
};

// update rider vehicle information
const updateRiderVehicleInfoInDb = async (req: Request, user: any) => {
  const files = req.files as any;

  // Check if the body exists before parsing
  let vehicleInfo;
  try {
    vehicleInfo = req.body.body ? JSON.parse(req.body.body) : {};
  } catch (err) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid JSON in the request body"
    );
  }

  // Find the rider based on the user's id
  const rider = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!rider) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
  }

  // Find the existing vehicle information for the rider
  const existingVehicleInfo = await prisma.riderVehicleInfo.findFirst({
    where: { userId: user.id },
  });

  if (!existingVehicleInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle information not found");
  }

  // Prepare images if they are uploaded, otherwise use the existing ones
  const vehicleRegistrationImage = files?.vehicleRegistrationImage
    ? files.vehicleRegistrationImage.map((file: any) => ({
        url: `${config.backend_base_url}/uploads/${file.originalname}`,
      }))
    : existingVehicleInfo.vehicleRegistrationImage;

  const vehicleInsuranceImage = files?.vehicleInsuranceImage
    ? files.vehicleInsuranceImage.map((file: any) => ({
        url: `${config.backend_base_url}/uploads/${file.originalname}`,
      }))
    : existingVehicleInfo.vehicleInsuranceImage;

  const drivingLicenceImage = files?.drivingLicenceImage
    ? files.drivingLicenceImage.map((file: any) => ({
        url: `${config.backend_base_url}/uploads/${file.originalname}`,
      }))
    : existingVehicleInfo.drivingLicenceImage;

  // Prepare the update data
  const vehicleInfoData = {
    vehicleMake: vehicleInfo.vehicleMake || existingVehicleInfo.vehicleMake,
    vehicleModel: vehicleInfo.vehicleModel || existingVehicleInfo.vehicleModel,
    vehicleYear: vehicleInfo.vehicleYear || existingVehicleInfo.vehicleYear,
    vehicleColor: vehicleInfo.vehicleColor || existingVehicleInfo.vehicleColor,
    vehicleLicensePlateNumber:
      vehicleInfo.vehicleLicensePlateNumber ||
      existingVehicleInfo.vehicleLicensePlateNumber,
    vehicleRegistrationImage,
    vehicleInsuranceImage,
    drivingLicenceImage,
  };

  // Perform the update
  const result = await prisma.riderVehicleInfo.update({
    where: { id: existingVehicleInfo.id }, // Use the unique ID to update the record
    data: vehicleInfoData,
  });

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update vehicle info"
    );
  }

  return result;
};

// delete vehicle info
const deleteRiderVehicleInfoFromDb = async (userId: any) => {
  const rider = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!rider) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
  }

  const vehicleInfo = await prisma.riderVehicleInfo.findFirst({
    where: { userId: userId },
  });

  if (!vehicleInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle information not found");
  }

  const result = await prisma.riderVehicleInfo.deleteMany({
    where: { userId: userId },
  });

  return result;
};

export const VehicleInfoService = {
  createRiderVehicleInfoIntoDb,
  getRiderVehicleInfoFromDb,
  deleteRiderVehicleInfoFromDb,
  updateRiderVehicleInfoInDb,
};
