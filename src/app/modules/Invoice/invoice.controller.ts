import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { invoiceServices } from "./invoice.service";
import sendResponse from "../../../shared/sendResponse";

const createInvoice = catchAsync(async (req: Request, res: Response) => {
  const result = await invoiceServices.createInvoiceInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "invoice created successfully",
    data: result,
  });
});

const getAllInvoices = catchAsync(async (req: Request, res: Response) => {
  const result = await invoiceServices.getAllInvoicesFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All invoices retrieved successfully",
    data: result,
  });
});

const getInvoiceById = catchAsync(async (req: Request, res: Response) => {
  const result = await invoiceServices.getInvoiceByIdFromDB(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "invoice retrieved successfully",
    data: result,
  });
});

const updateInvoice = catchAsync(async (req: Request, res: Response) => {
  const result = await invoiceServices.updateInvoiceInDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "invoice updated successfully",
    data: result,
  });
});

export const invoiceControllers = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
};
