import express from "express";
import { RiderRequestController } from "./ride.controller";

const router = express.Router();

// create ride request
router.post("/request", RiderRequestController.createRideRequest);

export const rideRoute = router;
