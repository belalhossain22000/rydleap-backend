import express from "express";
import { promotionsControllers } from "./promotion.controller";

const router = express.Router();

router.post("/create", promotionsControllers.createPromotions);
router.get("/", promotionsControllers.getPromotions);

export const promotionsRoute = router;
