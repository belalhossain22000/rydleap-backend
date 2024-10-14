import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { RiderVehicleInfoController } from "./riderVehicleInfo.controller";
import { RiderVehicleValidationSchema } from "./riderVehicleInfo.validation";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  fileUploader.uploadRiderVehicleInfo,
  RiderVehicleInfoController.createRiderVehicleInfo
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.RIDER, UserRole.USER),
  RiderVehicleInfoController.getAllRiderVehicleInfo
);
router.get(
  "/get-my-vehicle-info",
  auth(UserRole.ADMIN, UserRole.RIDER, UserRole.USER),
  RiderVehicleInfoController.getRiderVehicleInfo
);
router.put(
  "/update-my-vehicle-info",
  auth(UserRole.ADMIN, UserRole.RIDER, UserRole.USER),
  fileUploader.uploadRiderVehicleInfo,
  RiderVehicleInfoController.updateRiderVehicleInfo
);
router.delete(
  "/delete-vehicle-info",
  auth(UserRole.ADMIN, UserRole.RIDER, UserRole.USER),
  RiderVehicleInfoController.deleteRiderVehicleInfo
);

export const RiderVehicleInfoRoutes = router;
