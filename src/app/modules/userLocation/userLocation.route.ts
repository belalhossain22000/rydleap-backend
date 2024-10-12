import express from "express";
import { UserLocationController } from "./userLocation.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.post(
  "/",
  UserLocationController.createUserLocation
);
router.get("/:id", UserLocationController.getUserLocation);
router.put("/:id", UserLocationController.updateUserLocation);
router.delete("/:id", UserLocationController.deleteUserLocation);

export const userLocationRoute = router;
