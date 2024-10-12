import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { packageController } from "./package.controller";

const router = express.Router();

router.post(
  "/create-package",

  packageController.createPackage
);
router.get("/", packageController.getAllPackages);
router.get("/:id", packageController.getPackageById);
router.put("/:id", auth(UserRole.USER), packageController.updatePackage);
router.delete("/:id", auth(UserRole.ADMIN), packageController.deletePackage);

export const packageRoute = router;
