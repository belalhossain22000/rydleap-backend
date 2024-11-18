import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

//for login user
const createPaymentMethodIntoDB = async (payload: any, userId: string) => {
  const existingMethod = await prisma.paymentMethod.findUnique({
    where: { paymentMethod: payload.paymentMethod },
  });

  if (existingMethod) {
    throw new ApiError(409, "Payment method already exists");
  }
  const result = await prisma.paymentMethod.create({
    data: {
      ...payload,
      userId: userId,
    },
  });

  return result;
};

//for login user
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

//for admin
const createMethod = async (payload: any, userId: string) => {
  const existingMethod = await prisma.paymentMethod.findUnique({
    where: { paymentMethod: payload.paymentMethod },
  });

  if (existingMethod) {
    throw new ApiError(409, "Payment method already exists");
  }
  const result = await prisma.paymentMethod.create({
    data: { ...payload, userId: userId },
  });

  return result;
};

// get default payment methods
const getDefaultMethods = async () => {
  const result = await prisma.paymentMethod.findMany({
    where: {
      user: {
        role: "ADMIN",
      },
    },
  });

  if (result.length === 0) {
    throw new ApiError(404, "Default payment methods not found");
  }

  return result;
};

export const paymentMethodService = {
  createPaymentMethodIntoDB,
  getPaymentMethodsByUserIdFromDB,
  createMethod,
  getDefaultMethods,
};
