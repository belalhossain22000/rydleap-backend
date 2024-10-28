import express from "express";
import auth from "../../middlewares/auth";
import { paymentInfoController } from "./paymentInfo.controller";

const router = express.Router();

router.post("/create", auth(), paymentInfoController.paymentInfoCreate);
router.get("/", auth(), paymentInfoController.paymentInfoGetByUserId);

export const paymentInfoRoute = router;
