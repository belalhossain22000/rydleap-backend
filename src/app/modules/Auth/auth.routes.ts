import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "../User/user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { authValidation } from "./auth.validation";
import passport from "passport";

const router = express.Router();

// user login route
router.post(
  "/login",
  // validateRequest(UserValidation.UserLoginValidationSchema),
  AuthController.loginUser
);
// user logout route
router.post("/logout", AuthController.logoutUser);

// generate refresh token for getting access token

router.get("/get-me", auth(), AuthController.getMyProfile);

router.put(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);
router.patch("/reset-password-app", AuthController.resetPasswordFromApp);

// social login
// Initiate Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle the Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // JWT generation and response here
  }
);

router.patch("/update-fcp/:mail/:fcp", AuthController.updateFcpToken);

export const AuthRoutes = router;
