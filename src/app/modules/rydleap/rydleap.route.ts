import express from "express";
import { rydleapController } from "./rydleap.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.post(
  "/create-profile",
  auth(UserRole.ADMIN),
  fileUploader.uploadSiteLogo,
  rydleapController.createRydleapProfile
);

router.get(
  "/profile",
  auth(UserRole.ADMIN),
  rydleapController.getRydleapProfiles
);

router.patch(
  "/update-profile/:id",
  auth(UserRole.ADMIN),
  fileUploader.uploadSiteLogo,
  rydleapController.updateRydleapProfile
);

router.delete(
  "/delete-profile/:id",
  auth(UserRole.ADMIN),
  rydleapController.deleteRydleapProfile
);

export const rydleapRoutes = router;
