import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createPromotionsIntoDB = async (payload: any) => {
  const promotion = await prisma.offer.create({
    data: payload,
  });
  return promotion;
};

const getPromotionsOfferIntoDB = async () => {
  const promotions = await prisma.offer.findMany();
  if (promotions.length === 0) {
    throw new ApiError(404, "promotions not found!");
  }
  return promotions;
};

export const promotionsServices = {
  createPromotionsIntoDB,
  getPromotionsOfferIntoDB,
};
