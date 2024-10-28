import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { SendMessageRoutes } from "../modules/otp/otp.route";
import { userRoutes } from "../modules/User/user.route";
// import { RiderVehicleInfoRoutes } from "../modules/riderVehicleInfo/riderVehicleInfo.route";
import { contactRoutes } from "../modules/contact/contact.route";
import { notificationsRoute } from "../modules/notifications/notification.route";
import { packageRoute } from "../modules/package/package.route";
import { promotionsRoute } from "../modules/promotions/promotion.routes";
import { rideRoute } from "../modules/ride/ride.route";
import { RiderReviewRoute } from "../modules/RiderReview/riderReview.route";
import { RiderVehicleInfoRoutes } from "../modules/riderVehicleInfo/riderVehicleInfo.route";
import { rydleapRoutes } from "../modules/rydleap/rydleap.route";
import { StripeRoutes } from "../modules/Stripe/stripe.routes";
import { userLocationRoute } from "../modules/userLocation/userLocation.route";
import { paymentRoutes } from "../modules/Paypal/paypal.routes";
import { paymentInfoRoute } from "../modules/PaymentInfo/paymentInfo.routes";
import { paymentMethodRoute } from "../modules/PaymentMethod/paymentMethod.routes";
import { transactionRoutes } from "../modules/Transactions/transaction.routes";

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
  {
    path: "/rydleap",
    route: rydleapRoutes,
  },
  {
    path: "/user-location",
    route: userLocationRoute,
  },

  {
    path: "/notifications",
    route: notificationsRoute,
  },

  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/payment-method",
    route: paymentMethodRoute,
  },
  {
    path: "/payment-info",
    route: paymentInfoRoute,
  },
  {
    path: "/stripe",
    route: StripeRoutes,
  },
  {
    path: "/transactions",
    route: transactionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
