import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ChatService } from "./chat.service";

const createConversation = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.createConversation(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversation created successfully",
    data: result,
  });
});
const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.sendMessage(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "message send successfully",
    data: result,
  });
});
const getMessagesInConversation = catchAsync(
  async (req: Request, res: Response) => {
    const conversationId = req.params.id;
    const result = await ChatService.getMessagesInConversation(conversationId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "getMessagesInConversation reterive successfully",
      data: result,
    });
  }
);
const getAllConversations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await ChatService.getAllConversations(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All conversatyion reterive successfully",
    data: result,
  });
});

export const ChatController = {
  createConversation,
  sendMessage,
  getMessagesInConversation,
  getAllConversations,
};
