import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

// Todo need to change payload interface and user interfacce
const createRideRequest = async (payload: any, user: any) => {
  const isPackageExist = await prisma.package.findUnique({
    where: {
      id: payload.packageId,
    },
  });

  if (!isPackageExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Package not found");
  }

  // Check for an existing ride request
  const existingRide = await prisma.ride.findFirst({
    where: {
      userId: user.id,
      status: {
        not: {
          in: ["COMPLETED", "CANCELLED"],
        },
      },
    },
  });

  if (existingRide) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You already have an incomplete ride request"
    );
  }

  // Create the new ride request
  const ride = await prisma.ride.create({
    data: { ...payload, userId: user.id },
  });

  if (!ride) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create ride request"
    );
  }

  // Find the nearest available rider
  const { pickupLat, pickupLng } = payload;

  const riders = await prisma.user.findMany({
    where: {
      role: "RIDER",
      status: "ACTIVE",
      isAvailable: true,
    },
    include: {
      riderVehicleInfo: true,
      locations: true,
    },
  });

  if (riders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No available riders found");
  }

  // Haversine distance calculation
  const haversineDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  let nearestRider = null;
  let nearestDistance = Infinity;

  for (const rider of riders) {
    // Check if the rider has a location entry
    if (rider.locations.length > 0) {
      const riderLocation = rider.locations[0];
      const distance = haversineDistance(
        pickupLat,
        pickupLng,
        riderLocation.locationLat,
        riderLocation.locationLng
      );

      // Update nearest rider if found closer
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestRider = rider;
      }
    }
  }

  if (nearestRider) {
    // Update the ride request with the assigned rider
    const updatedRide = await prisma.ride.update({
      where: { id: ride.id },
      data: { riderId: nearestRider.id, status: "PENDING" },
    });

    return {
      ride: updatedRide,
      assignedRider: nearestRider,
    };
  }

  throw new ApiError(httpStatus.NOT_FOUND, "No suitable rider found");
};

const getRideRequestsByRiderId = async (riderId: string) => {
  // Fetch ride requests for the specified rider with status PENDING
  const rides = await prisma.ride.findMany({
    where: {
      riderId: riderId,
      status: "PENDING",
    },
    include: {
      user: true,
      rider: true,
      package: true,
    },
  });

  if (!rides || rides.length === 0) {
    return "No pending ride requests found for this rider";
  }
  return rides;
};

const getRideRequestsByUserId = async (riderId: string) => {
  // Fetch ride requests for the specified rider with status PENDING
  const rides = await prisma.ride.findMany({
    where: {
      userId: riderId,
      status: "PENDING",
    },
    include: {
      user: true,
      rider: true,
      package: true,
    },
  });

  if (!rides || rides.length === 0) {
    return "No pending ride requests found for this rider";
  }
  return rides;
};

const getAllRideRequestsFromDb = async () => {
  const rides = await prisma.ride.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (rides.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Ride Request Found");
  }

  return rides;
};

// update ride status
const updateRideStatusByRideId = async (payload: any, rideId: string) => {
  const isRideExist = await prisma.ride.findUnique({
    where: {
      id: rideId,
    },
  });
  if (!isRideExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
  }
  const updatedRide = await prisma.ride.update({
    where: { id: rideId },
    data: payload,
  });
  if (!updatedRide) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update ride status"
    );
  }

  return updatedRide;
};

// get ride history from ride table
const getRideHistoryByRiderId = async (riderId: string) => {
  const rides = await prisma.ride.findMany({
    where: {
      riderId: riderId,
    },
    include: {
      user: {
        include: {
          riderReviewsAsRider: true,
        },
      },
    },
  });

  if (rides.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No ride history found for this rider"
    );
  }
  return rides;
};

// get user history by user id
const getRideHistoryByUserId = async (userId: string) => {
  const rides = await prisma.ride.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        include: {
          riderReviewsAsCustomer: true,
        },
      },
    },
  });

  if (rides.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No user history found for this rider"
    );
  }
  return rides;
};

export const RideRequestService = {
  createRideRequest,
  getRideRequestsByRiderId,
  getAllRideRequestsFromDb,
  getRideRequestsByUserId,
  updateRideStatusByRideId,
  getRideHistoryByRiderId,
  getRideHistoryByUserId,
};
