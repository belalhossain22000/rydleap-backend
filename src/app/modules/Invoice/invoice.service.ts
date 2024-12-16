import { Invoice } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createInvoiceInDB = async (payload: any) => {
  const result = await prisma.invoice.create({
    data: payload,
  });

  return result;
};

const getAllInvoicesFromDB = async () => {
  const invoices = await prisma.invoice.findMany();
  return invoices;
};

const getInvoiceByIdFromDB = async (invoiceId: string) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });
  return invoice;
};

const updateInvoiceInDB = async (invoiceId: string, payload: any) => {
  const updatedInvoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: payload,
  });

  return updatedInvoice;
};

export const invoiceServices = {
  createInvoiceInDB,
  getAllInvoicesFromDB,
  getInvoiceByIdFromDB,
  updateInvoiceInDB,
};
