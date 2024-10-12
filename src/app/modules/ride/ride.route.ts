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
router.put(
  "/request/:rideId",
  // auth(UserRole.ADMIN),
  validateRequest(updateRideValidationSchema),
  RiderRequestController.updateRideRequestByRideId
);

export const rideRoute = router;
