import express from "express";
import { SendOptController } from "./otp.controller";
const router = express.Router();

router.post("/send-otp", SendOptController.sendOtpMessage);
router.post("/verify-otp", SendOptController.verifyOtpMessage);

export const SendMessageRoutes = router;
