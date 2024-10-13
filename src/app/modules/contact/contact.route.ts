import express from "express";
import { contactController } from "./contact.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/send-email",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.RIDER),
  contactController.sendEmailSupport
);

export const contactRoutes = router;
