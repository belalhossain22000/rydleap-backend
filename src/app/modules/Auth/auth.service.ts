import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import ApiError from "../../errors/ApiErrors";
import emailSender from "./emailSender";
import { UserRole, UserStatus } from "@prisma/client";
import httpStatus from "http-status";

// user login
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }
  if (userData.status === UserStatus.BLOCKED) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked!");
  }
  if (userData.isDeleted === true) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is deleted!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password as string,
    userData.password as string
  );
  console.log(isCorrectPassword);

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const result = {
    accessToken,
  };
  return result;
};

// get user profile
const getMyProfile = async (user: any) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo?.role === UserRole.USER) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo?.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

// change password

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  if (!userData) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    userData.password as string
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: "Password changed successfully" };
};

// FORGOT PASSWORD
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  const result = await emailSender(
    "Reset Your Password",
    userData.email,
    `
     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${userData.email},</p>

          <p>We received a request to reset your password. Click the button below to reset your password:</p>

          <a href="${resetPassLink}" style="text-decoration: none;">
            <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
              Reset Password
            </button>
          </a>

          <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>

          <p>Thank you,<br>Rydleap</p>
</div>

      `
  );
  return result;
};

// reset password
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData.email) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found!");
  }

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden !");
  }

  // hash password
  const password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
  return { message: "Password reset successfully" };
};

//reset password for app
const resetPasswordFromAppIntoDB = async (payload: {
  phoneNumber: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findFirst({
    where: { phoneNumber: payload.phoneNumber },
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // hash password
  const password = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: password,
    },
  });

  return user;
};

export const AuthServices = {
  loginUser,
  getMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  resetPasswordFromAppIntoDB,
};
