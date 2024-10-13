import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { promotionsServices } from "./promotion.service";

const createPromotions = catchAsync(async (req, res) => {
  const promotions = await promotionsServices.createPromotionsIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Promotions Created successfully",
    data: promotions,
  });
});

const getPromotions = catchAsync(async (req, res) => {
  const promotions = await promotionsServices.getPromotionsOfferIntoDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promotions offer retrived successfully",
    data: promotions,
  });
});

export const promotionsControllers = {
  createPromotions,
  getPromotions,
};
