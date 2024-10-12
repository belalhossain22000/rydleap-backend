import { Request } from "express";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { ObjectId } from "mongodb";
import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { IPaginationOptions } from "../../interfaces/paginations";
import { IVehicleInfoFilterRequest } from "./vehicleInfo.interface";

// create vehivle information
const createRiderVehicleInfoIntoDb = async (req: Request, user: any) => {
  const files = req.files as any;


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

const getAllRiderVehicleInfosFromDb = async (
  user: any,
  params: IVehicleInfoFilterRequest,
  options: IPaginationOptions
) => {
  // Ensure the rider exists
  const rider = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!rider) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
  }

  // Destructure pagination values (page, limit, skip)
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  // Destructure search term and other filters from the params
  const { searchTerm, ...filterData } = params;

  // Array to hold filter conditions
  const andConditions: Prisma.RiderVehicleInfoWhereInput[] = [];

  // Search logic (for example, vehicleMake, vehicleModel)
  if (searchTerm) {
    andConditions.push({
      OR: ["vehicleMake", "vehicleModel", "vehicleLicensePlateNumber"].map(
        (field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })
      ),
    });
  }

  // Add other filter conditions if any are provided
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Combine all conditions into where clause
  const whereConditions: Prisma.RiderVehicleInfoWhereInput =
    andConditions.length > 0
      ? { AND: andConditions, userId: user.id }
      : { userId: user.id };

  // Fetch the vehicle information with pagination, sorting, and filtering
  const vehicleInfos = await prisma.riderVehicleInfo.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  // If no results, throw an error
  if (!vehicleInfos.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "No vehicle information found");
  }

  // Count the total number of vehicle records matching the conditions
  const total = await prisma.riderVehicleInfo.count({
    where: whereConditions,
  });

  // Return paginated result
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: vehicleInfos,
  };
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
  getAllRiderVehicleInfosFromDb,
};
