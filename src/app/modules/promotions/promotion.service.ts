import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createPromotionsIntoDB = async (payload: any) => {
  const isExistingPromotions = await prisma.offer.findFirst({
    where: {
      title: payload.title,
    },
  });

  if (isExistingPromotions) {
    throw new ApiError(409, "This promotion already exists!");
  }

  const result = await prisma.offer.create({
    data: payload,
  });
  return result;
};

const getPromotionsOfferFromDB = async () => {
  const result = await prisma.offer.findMany();
  if (result.length === 0) {
    throw new ApiError(404, "promotions not found!");
  }
  return result;
};

const updatePromotionIntoDB = async (payload: any, promotionId: string) => {
  const promotionExists = await prisma.offer.findFirst({
    where: {
      id: promotionId,
    },
  });

  if (!promotionExists) {
    throw new ApiError(404, "Promotion not found!");
  }

  const result = await prisma.offer.update({
    where: {
      id: promotionId,
    },
    data: payload,
  });

  return result;
};

const deletePromotionIntoDB = async (promotionId: string) => {
  const promotionExists = await prisma.offer.findFirst({
    where: {
      id: promotionId,
    },
  });

  if (!promotionExists) {
    throw new ApiError(404, "Promotion not found!");
  }

  await prisma.offer.delete({
    where: {
      id: promotionId,
    },
  });

  return;
};

export const promotionsServices = {
  createPromotionsIntoDB,
  getPromotionsOfferFromDB,
  updatePromotionIntoDB,
  deletePromotionIntoDB,
};
