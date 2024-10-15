import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createConversation = async (payload: any) => {
  const { userIds } = payload;

  // Validate input
  if (!Array.isArray(userIds) || userIds.length < 2) {
    throw new Error(
      "At least two users are required to create a conversation."
    );
  }

  // Check if users exist
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
  });

  if (users.length !== userIds.length) {
    const existingUserIds = users.map((user) => user.id);
    const missingUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId)
    );
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `User(s) not found: ${missingUserIds.join(", ")}`
    );
  }

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: userIds.map((userId: string) => ({
          userId,
        })),
      },
    },
  });

  return conversation;
};

const sendMessage = async (payload: any) => {
  const { conversationId, senderId, content } = payload;
  // Validate input
  if (!conversationId || !senderId || !content) {
    throw new ApiError(
      httpStatus.OK,
      "Conversation ID, sender ID, and content are required to send a message."
    );
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
  });

  return message;
};

const getMessagesInConversation = async (conversationId: string) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required to retrieve messages.");
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc", // Sort messages by creation date
    },
  });

  return messages;
};

const getAllConversations = async (userId: string) => {

  if (!userId) {
    throw new Error("User ID is required to retrieve conversations.");
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
      participants: true,
    },
  });

  return conversations;
};

export const ChatService = {
  createConversation,
  sendMessage,
  getMessagesInConversation,
  getAllConversations,
};
