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

router.get(
  "/:riderId",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderReviewController.getAverageRatingByRiderId
);

router.put(
  "/:reviewId",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderReviewController.updateReviewByCustomerId
);

router.delete(
  "/:reviewId",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.RIDER),
  RiderReviewController.deleteReviewByCustomerId
);

export const RiderReviewRoute = router;
