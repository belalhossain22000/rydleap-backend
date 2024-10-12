import { UserLocation } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

// create user location
const createUserLocationIntoDb = async (payload: UserLocation) => {

  const existingUserLocation = await prisma.userLocation.findFirst({
    where: { userId: payload.userId },
  });

  if (existingUserLocation) {
    throw new ApiError(httpStatus.CONFLICT, "User location already exists");
  }

  const result = await prisma.userLocation.create({
    data: payload,
  });
  if (!result.id) {
    throw new ApiError(httpStatus.OK, "UserLocation Created successfully");
  }
  return result;
};

// get user location by id
const getUserLocationByIdIntoDb = async (userId: string) => {
  const result = await prisma.userLocation.findFirst({
    where: { userId: userId },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "UserLocation not found");
  }
  return result;
};

//update user location by id
const updateUserLocationByIdIntoDb = async (
  userId: string,
  updateLocation: any
) => {
  const userLocation = await prisma.userLocation.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!userLocation) {
    throw new Error("User location not found");
  }

  const result = await prisma.userLocation.update({
    where: {
      id: userLocation.id,
    },
    data: {
      locationLat: updateLocation.locationLat,
      locationLng: updateLocation.locationLng,
    },
  });
  return result;
};

// delete user location by id
const deleteUserLocationByIdIntoDb = async (userId: string) => {
  const userLocation = await prisma.userLocation.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!userLocation) {
    throw new Error("User location not found");
  }

  const result = await prisma.userLocation.delete({
    where: {
      id: userLocation.id,
    },
  });
  return result;
};

export const UserLocationService = {
  createUserLocationIntoDb,
  getUserLocationByIdIntoDb,
  updateUserLocationByIdIntoDb,
  deleteUserLocationByIdIntoDb,
};
