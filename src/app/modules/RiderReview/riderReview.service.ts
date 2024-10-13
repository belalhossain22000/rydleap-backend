import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createReview = async (paylaod: any, customerId: string) => {
  const isRideExist = await prisma.ride.findFirst({
    where: {
      id: paylaod.rideId,
      status: "COMPLETED",
      userId: customerId,
    },
  });

  if (!isRideExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
  }

  const isReviewExist = await prisma.riderReview.findFirst({
    where: {
      rideId: paylaod.rideId,
      customerId,
      riderId: paylaod.riderId,
    },
  });

  if (isReviewExist) {
    throw new ApiError(httpStatus.CONFLICT, "Review already exists");
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

  if (reviews.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No reviews found");
  }
  return reviews;
};

const getAverageRatingByRiderIdFromDb = async (riderId: string) => {
  const ratings = await prisma.riderReview.findMany({
    where: {
      riderId,
    },
    select: {
      rating: true,
    },
  });

  if (ratings.length === 0) return 0;

  const total = ratings.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = total / ratings.length;

  return averageRating;
};

const updateReviewById = async (
  payload: any,
  customerId: string,
  reviewId: string
) => {
  const isReviewExist = await prisma.riderReview.findFirst({
    where: {
      id: reviewId,
      customerId,
    },
  });

  if (!isReviewExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not Found");
  }
  const updateReview = await prisma.riderReview.update({
    where: {
      id: reviewId,
      customerId,
    },
    data: {
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return updateReview;
};

const deleteReviewById = async (customerId: string, reviewId: string) => {
  const isReviewExist = await prisma.riderReview.findFirst({
    where: {
      id: reviewId,
      customerId,
    },
  });

  if (!isReviewExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not Found");
  }
  await prisma.riderReview.delete({
    where: {
      id: reviewId,
      customerId,
    },
  });

  return;
};

export const RiderReviewService = {
  createReview,
  getReviewsByRider,
  updateReviewById,
  deleteReviewById,
  getAverageRatingByRiderIdFromDb,
};
