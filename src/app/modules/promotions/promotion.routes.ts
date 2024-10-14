import express from "express";
import { promotionsControllers } from "./promotion.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  promotionsControllers.createPromotion
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.RIDER, UserRole.USER),
  promotionsControllers.getPromotions
);

router.put(
  "/:promotionId",
  auth(UserRole.ADMIN),
  promotionsControllers.updatePromotion
);

router.delete(
  "/:promotionId",
  auth(UserRole.ADMIN),
  promotionsControllers.deletePromotion
);

export const promotionsRoute = router;
