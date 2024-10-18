import express from "express";
import { notificationController } from "./notification.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/send-notification/:fcmToken",
  auth(),
  notificationController.sendNotification
);

router.post(
  "/send-notification",
  auth(),
  notificationController.sendNotifications
);

export const notificationsRoute = router;
