import Twilio from "twilio";

import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import config from "../../../config";

// send otp for validations the phone number
const sendOtpMessage = async (payload: any) => {
  const client = Twilio(config.twilio.accountSid, config.twilio.authToken);
  const OTP_EXPIRY_TIME = 2 * 60 * 1000;
  const { phoneNumber } = payload;

  if (!phoneNumber) {
    throw new ApiError(httpStatus.NOT_FOUND, "Phone number is required");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + OTP_EXPIRY_TIME);

  // Store OTP in database using Prisma
  const isStoredOtp = await prisma.oTP.upsert({
    where: { phoneNumber },
    update: { otpCode: otp, expiry },
    create: { phoneNumber, otpCode: otp, expiry },
  });
  if (!isStoredOtp) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to store OTP in the database."
    );
  }
  // Send OTP via Twilio SMS
  const result = await client.messages.create({
    body: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
    from: config.twilio.twilioPhoneNumber,
    to: phoneNumber,
  });

  const formateRes = {
    body: result.body,
    from: result.from,
    to: result.to,
    status: result.status,
    sid: result.sid,
    dateCreated: result.dateCreated,
  };
  return formateRes;
};

// verify the otp for validations the phone number

const verifyOtpMessage = async (payload: any) => {
  const { phoneNumber, otp } = payload;

  if (!phoneNumber || !otp) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Phone number and OTP are required"
    );
  }

  const storedOtp = await prisma.oTP.findUnique({
    where: { phoneNumber },
  });

  if (!storedOtp) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OTP not found. Please request a new one.' "
    );
  }

  if (new Date() > storedOtp.expiry) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      "OTP has expired. Please request a new one."
    );
  }

  if (storedOtp.otpCode !== otp) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid OTP. Please check the code and try again."
    );
  }
  return {phoneNumber};
};

export const SendOptService = {
  sendOtpMessage,
  verifyOtpMessage,
};
