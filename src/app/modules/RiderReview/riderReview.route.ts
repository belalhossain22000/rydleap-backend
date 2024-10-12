import express from "express";
import { RiderReviewController } from "./riderReview.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { RiderReviewValidationSchema } from "./riderReview.validation";
const router = express.Router();
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  validateRequest(RiderReviewValidationSchema),
  RiderReviewController.createReview
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  //   validateRequest(RiderReviewValidationSchema),
  RiderReviewController.getReviewsByRider
);

export const RiderReviewRoute = router;
