import { User } from "@prisma/client";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { transactionService } from "./transaction.service";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const transactionData = req.body;
  transactionData.userId = (req?.user as User)?.id;
  const result = await transactionService.createTransactionIntoDB(
    transactionData
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Create user transaction successfully",
    data: result,
  });
});

const getUserTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.getUserTransactionsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user transaction retrieved successfully",
    data: result,
  });
});

export const transactionController = {
  createTransaction,
  getUserTransactions,
};
