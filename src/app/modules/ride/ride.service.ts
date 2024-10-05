import prisma from "../../../shared/prisma";

const createRideRequest = async (payload: any) => {
  const { userId, originLat, originLng, destinationLat, destinationLng } =
    payload;

  // Create a new ride with PENDING status
  const ride = await prisma.ride.create({
    data: payload,
  });

  // // Find the nearest available rider
  // const nearestRider = await findNearestRider(originLat, originLng);

  // if (nearestRider) {
  //   // Send a request to the nearest rider (through Socket.io, for example)
  //   io.to(nearestRider.socketId).emit("rideRequest", {
  //     rideId: ride.id,
  //     originLat,
  //     originLng,
  //     destinationLat,
  //     destinationLng,
  //   });
  // }
};

export const RideRequestService = {
  createRideRequest,
};
