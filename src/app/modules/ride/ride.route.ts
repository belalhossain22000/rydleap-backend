import express from "express";
import { RiderRequestController } from "./ride.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { updateRideValidationSchema } from "./ride.validation";

const router = express.Router();

// create ride request
router.post(
  "/request",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderRequestController.createRideRequest
);
router.get(
  "/request/rider",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderRequestController.getRiderByRiderId
);
router.get(
  "/request/user",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderRequestController.getRiderByUserId
);

router.get(
  "/request",
  auth(UserRole.ADMIN),
  RiderRequestController.getRideRequests
);
router.get(
  "/rider-history",
  auth(UserRole.ADMIN, UserRole.RIDER),
  RiderRequestController.getRideHistoryByRiderId
);
router.get(
  "/user-history",
  auth(UserRole.ADMIN, UserRole.USER),
  RiderRequestController.getRideHistoryByUserId
);
router.put(
  "/request/:rideId",
  auth(UserRole.RIDER),
  validateRequest(updateRideValidationSchema),
  RiderRequestController.updateRideRequestByRideId
);

router.get(
  "/request/:rideId",
  auth(UserRole.RIDER),
  RiderRequestController.getRideRequest
);

export const rideRoute = router;
