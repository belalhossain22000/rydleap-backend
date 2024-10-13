import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { SendMessageRoutes } from "../modules/otp/otp.route";
// import { RiderVehicleInfoRoutes } from "../modules/riderVehicleInfo/riderVehicleInfo.route";
import { rideRoute } from "../modules/ride/ride.route";
import { packageRoute } from "../modules/package/package.route";
import { RiderVehicleInfoRoutes } from "../modules/riderVehicleInfo/riderVehicleInfo.route";
import { RiderReviewRoute } from "../modules/RiderReview/riderReview.route";
import { contactRoutes } from "../modules/contact/contact.route";
import { promotionsRoute } from "../modules/promotions/promotion.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/otp",
    route: SendMessageRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/riderVehicleInfo",
    route: RiderVehicleInfoRoutes,
  },
  {
    path: "/ride",
    route: rideRoute,
  },
  {
    path: "/package",
    route: packageRoute,
  },
  {
    path: "/review",
    route: RiderReviewRoute,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/promotions",
    route: promotionsRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
