import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();


// create user
router.post(
  "/register",
  userController.createUser
);
// create user
router.post(
  "/social",
  userController.socialLogin
);
// *!get all  user
router.get("/", userController.getUsers);

// *!profile user
router.put(
  "/profile",
  // validateRequest(UserValidation.userUpdateSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  userController.updateProfile
);

// *!update  user
router.put("/:id", auth(UserRole.ADMIN), userController.updateUser);

export const userRoutes = router;
