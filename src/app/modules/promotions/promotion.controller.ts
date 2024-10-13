import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { promotionsServices } from "./promotion.service";

const createPromotion = catchAsync(async (req, res) => {
  const promotions = await promotionsServices.createPromotionsIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Promotions Created successfully",
    data: promotions,
  });
});

const getPromotions = catchAsync(async (req, res) => {
  const promotions = await promotionsServices.getPromotionsOfferFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promotions offer retrived successfully",
    data: promotions,
  });
});

const updatePromotion = catchAsync(async (req, res) => {
  const promotionId: string = req.params.promotionId;
  const updatedPromotions = await promotionsServices.updatePromotionIntoDB(
    req.body,
    promotionId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promotions updated successfully",
    data: updatedPromotions,
  });
});

const deletePromotion = catchAsync(async (req, res) => {
  const promotionId: string = req.params.promotionId;
  await promotionsServices.deletePromotionIntoDB(promotionId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promotions deleted successfully",
    data: null,
  });
});

export const promotionsControllers = {
  createPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
};
