// import express from "express";
// import validateRequest from "../../middlewares/validateRequest";
// import { RiderVehicleInfoController } from "./riderVehicleInfo.controller";
// import { RiderVehicleValidationSchema } from "./riderVehicleInfo.validation";
// import { fileUploader } from "../../../helpars/fileUploader";
// import auth from "../../middlewares/auth";
// import { UserRole } from "@prisma/client";
// const router = express.Router();

// router.post(
//   "/",
//   auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
//   fileUploader.uploadRiderVehicleInfo,
//   // validateRequest(RiderVehicleValidationSchema.createRiderVehicleInfoSchema),
//   RiderVehicleInfoController.createRiderVehicleInfo
// );

// export const RiderVehicleInfoRoutes = router;
