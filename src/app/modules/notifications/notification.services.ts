import admin from "../../../helpars/firebaseAdmin";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

// Send notification to a single user
const sendSingleNotification = async (req: any) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.userId },
  });

  if (!user?.fcpmToken) {
    throw new ApiError(404, "User not found with FCM token");
  }

  const message = {
    notification: {
      title: req.body.title,
      body: req.body.body,
    },
    token: user.fcpmToken,
  };
  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error: any) {
    if (error.code === "messaging/invalid-registration-token") {
      throw new ApiError(400, "Invalid FCM registration token");
    } else if (error.code === "messaging/registration-token-not-registered") {
      throw new ApiError(404, "FCM token is no longer registered");
    } else {
      throw new ApiError(500, "Failed to send notification");
    }
  }
};

// Send notifications to all users with valid FCM tokens
const sendNotifications = async (req: any) => {
  const users = await prisma.user.findMany({
    where: {
      fcpmToken: {
        not: null, // Ensure the token is not null
      },
    },
    select: {
      fcpmToken: true,
    },
  });

  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found with FCM tokens");
  }

  const fcmTokens = users.map((user) => user.fcpmToken);

  const message = {
    notification: {
      title: req.body.title,
      body: req.body.body,
    },
    tokens: fcmTokens,
  };

  const response = await admin.messaging().sendEachForMulticast(message as any);

  response.responses.forEach((res, idx) => {
    if (!res.success) {
      console.error(`Error sending to token ${fcmTokens[idx]}:`, res.error);
    }
  });

  const failedTokens = response.responses
    .map((res, idx) => (!res.success ? fcmTokens[idx] : null))
    .filter((token) => token !== null);

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
    failedTokens,
  };
};

export const notificationServices = {
  sendSingleNotification,
  sendNotifications,
};
