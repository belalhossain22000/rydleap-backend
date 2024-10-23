import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { transactionService } from "./transaction.service";

const getUserTransactions = catchAsync(async (req: Request, res: Response) => {
  const resutlt = await transactionService.getUserTransactionsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user transaction retrived successfully",
    data: resutlt,
  });
});

export const transactionController = {
  getUserTransactions,
};
