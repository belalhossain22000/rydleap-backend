import { User } from "@prisma/client";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { contactService } from "./contact.service";

const sendEmailSupport = catchAsync(async (req: any, res) => {
  const userId = req.user?.id;

  await contactService.sendEmailSupport(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "email send successfully",
    data: req.body,
  });
});

export const contactController = {
  sendEmailSupport,
};
