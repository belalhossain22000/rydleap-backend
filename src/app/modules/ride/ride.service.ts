import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { generateDateFilter } from "../../../helpars/generateDateFilter";

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

  // Find the nearest available rider
  const { pickupLat, pickupLng } = payload;

  const riders = await prisma.user.findMany({
    where: {
      role: "RIDER",
      // isOnline: true,
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

  // for (const rider of riders) {
  //   console.log("Rider:", rider);

  //   if (rider.locations.length > 0) {
  //     const riderLocation = rider.locations[0];
  //     console.log(`Rider ${rider.id} location:`, riderLocation);
  //   } else {
  //     console.log(`Rider ${rider.id} has no location.`);
  //   }
  // }

  for (const rider of riders) {
    // Check if the rider has a location entry
    if (rider.locations) {
      const riderLocation = rider.locations;
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
    // Create the new ride request
    const ride = await prisma.ride.create({
      data: { ...payload, userId: user.id },
    });

    // Update the ride request with the assigned rider
    const updatedRide = await prisma.ride.update({
      where: { id: ride.id },
      data: { riderId: nearestRider.id, status: "ACCEPTED" },
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
      user: {
        include: {
          locations: true,
        },
      },
      rider: {
        include: {
          locations: true,
        },
      },
      // package: true,
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
      user: {
        include: {
          locations: true,
        },
      },
      rider: {
        include: {
          locations: true,
        },
      },
      package: true,
    },
  });

  if (!rides || rides.length === 0) {
    return "No pending ride requests found for this rider";
  }
  return rides;
};

//view ride request info when see the ride request
const getRideRequestByRideId = async (rideId: string) => {
  const ride = await prisma.ride.findUnique({
    where: {
      id: rideId,
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phoneNumber: true,
          riderReviewsAsCustomer: true,
        },
        include: {
          locations: true,
        },
      },
    },
  });

  if (!ride) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
  }

  return ride;
};

const getAllRideRequestsFromDb = async (
  filter?: "weekly" | "monthly" | "yearly"
) => {
  const dateFilter = generateDateFilter(filter);
  const rides = await prisma.ride.findMany({
    where: dateFilter
      ? {
          createdAt: {
            gte: dateFilter,
          },
        }
      : undefined,

    orderBy: {
      createdAt: "desc",
    },
    include: {
      rider: { select: { fullName: true } },
      user: { select: { fullName: true } },
    },
  });

  const ongoingRides = await prisma.ride.count({
    where: dateFilter
      ? {
          createdAt: {
            gte: dateFilter, // Filter transactions greater than or equal to the date
          },
          status: "ACCEPTED",
        }
      : { status: "ACCEPTED" },
  });
  const completedRides = await prisma.ride.count({
    where: dateFilter
      ? {
          createdAt: {
            gte: dateFilter, // Filter transactions greater than or equal to the date
          },
          status: "COMPLETED",
        }
      : { status: "COMPLETED" },
  });

  const canceledRides = await prisma.ride.count({
    where: dateFilter
      ? {
          createdAt: {
            gte: dateFilter, // Filter transactions greater than or equal to the date
          },
          status: "CANCELLED",
        }
      : { status: "CANCELLED" },
  });

  return {
    rides,
    totalRides: rides.length,
    ongoingRides,
    completedRides,
    canceledRides,
  };
};

// update ride status
const updateRideStatusByRideId = async (req: any, rideId: string) => {
  const isRideExist = await prisma.ride.findUnique({
    where: {
      id: rideId,
    },
  });

  if (!isRideExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
  }

  const updatedRide = await prisma.ride.update({
    where: { id: rideId, riderId: req.user.id },
    data: req.body,
    include: {
      user: true,
    },
  });

  if (updatedRide.user) {
    updatedRide.user.password = null;
    updatedRide.user.fcpmToken = null;
  }

  if (!updatedRide) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update ride status"
    );
  }

  return updatedRide;
};

// get ride history by rider id
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
  return rides;
};

const getSingleRideHistoryFromDB = async (rideId: string, userId: string) => {
  const ride = await prisma.ride.findUnique({
    where: {
      id: rideId,
      userId: userId,
      riderId: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
          role: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
          role: true,
        },
      },
    },
  });

  return ride;
};

export const RideRequestService = {
  createRideRequest,
  getRideRequestsByRiderId,
  getAllRideRequestsFromDb,
  getRideRequestsByUserId,
  updateRideStatusByRideId,
  getRideHistoryByRiderId,
  getRideHistoryByUserId,
  getRideRequestByRideId,
  getSingleRideHistoryFromDB,
};
