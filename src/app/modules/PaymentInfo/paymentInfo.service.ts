import { PaymentInfo } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createPaymentInfoIntoDB = async (
  paylaod: PaymentInfo,
  userId: string
) => {
  const resutl = await prisma.paymentInfo.create({
    data: {
      ...paylaod,
      userId: userId,
    },
  });

  return resutl;
};

const getPaymentInfoByUserIdFromDB = async (userId: string) => {
  const result = await prisma.paymentInfo.findMany({
    where: {
      userId: userId,
    },
  });

  if (result.length === 0) {
    throw new ApiError(404, "Payment information not found!");
  }

  return result;
};

export const paymentInfoService = {
  createPaymentInfoIntoDB,
  getPaymentInfoByUserIdFromDB,
};
