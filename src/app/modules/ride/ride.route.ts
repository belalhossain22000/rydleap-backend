import express from "express";
import { RiderRequestController } from "./ride.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// create ride request
router.post(
  "/request",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderRequestController.createRideRequest
);
router.get(
  "/request/:riderId",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderRequestController.getRiderByRiderId
);

router.get(
  "/request",
  auth(UserRole.ADMIN),
  RiderRequestController.getRideRequests
);

export const rideRoute = router;
