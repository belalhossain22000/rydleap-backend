import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { RiderReview } from "./riderReview.interface";

const createReview = async (paylaod: any, customerId: string) => {
  const isRideExist = await prisma.ride.findUnique({
    where: {
      id: paylaod.rideId,
      status: "COMPLETED",
      userId: customerId,
      riderId: paylaod.riderId,
    },
  });
  if (!isRideExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
  }
  const result = await prisma.riderReview.create({
    data: {
      ...paylaod,
      customerId,
    },
  });
  if (!result.id) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create review"
    );
  }
  return result;
};

const getReviewsByRider = async (riderId: string) => {
  const reviews = await prisma.riderReview.findMany({
    where: {
      riderId,
    },
    include: {
      customer: true,
      ride: true,
    },
  });
  if (!reviews) {
    throw new ApiError(httpStatus.NOT_FOUND, "No reviews found");
  }
  return reviews;
};

export const RiderReviewService = {
  createReview,
  getReviewsByRider,
};
