import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createPaymentMethodIntoDB = async (payload: any, userId: string) => {
  const result = await prisma.paymentMethod.create({
    data: {
      ...payload,
      userId: userId,
    },
  });

  return result;
};

const getPaymentMethodsByUserIdFromDB = async (userId: string) => {
  const result = await prisma.paymentMethod.findMany({
    where: {
      userId: userId,
    },
  });

  if (result.length === 0) {
    throw new ApiError(404, "Payment Method Not Found");
  }

  return result;
};

export const paymentMethodService = {
  createPaymentMethodIntoDB,
  getPaymentMethodsByUserIdFromDB,
};
