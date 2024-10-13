import prisma from "../../../shared/prisma";
import { contactEmailSender } from "./contact.emailSend";

const sendEmailSupport = async (bodyData: any, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const htmlData = `<h1>issue: ${bodyData.issue}</h1> <br/> <p>Description: ${bodyData.description}</p>`;

  const result = contactEmailSender.emailSender(bodyData, user.email, htmlData);

  return result;
};

export const contactService = {
  sendEmailSupport,
};
