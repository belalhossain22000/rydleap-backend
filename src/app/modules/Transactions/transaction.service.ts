import prisma from "../../../shared/prisma";

const getUserTransactionsFromDB = async () => {
  const result = await prisma.userTransaction.findMany();
  return result;
};

export const transactionService = {
  getUserTransactionsFromDB,
};
