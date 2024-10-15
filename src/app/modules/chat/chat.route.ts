import express from "express";
import { ChatController } from "./chat.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.post("/", ChatController.createConversation);
router.post("/send-message", ChatController.sendMessage);
router.get("/:id/messages", ChatController.getMessagesInConversation);
router.get(
  "/:userId",

  ChatController.getAllConversations
);

export const chatRoutes = router;
