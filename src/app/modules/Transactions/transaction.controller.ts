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

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.getSingleTransactionFromDB(
    req.params.transactionId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Transaction retrieved successfully",
    data: result,
  });
});

const createPayout = catchAsync(async (req: any, res: Response) => {
  const riderId = req.user.id;
  const transactionData = req.body;
  const result = await transactionService.createPayoutInDB(
    transactionData,
    riderId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payout created successfully created",
    data: result,
  });
});

const getPayouts = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.getAllPayouts();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payouts retrieved successfully",
    data: result,
  });
});

const getPayout = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.getSinglePayout(req.params.payoutId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payout retrieved successfully retrieved",
    data: result,
  });
});

const getDriverPayouts = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  const result = await transactionService.getPayoutsForDriverFromDB(driverId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "driver payout amount retrived successfully",
    data: result,
  });
});

export const transactionController = {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  createPayout,
  getPayouts,
  getPayout,
  getDriverPayouts,
};
