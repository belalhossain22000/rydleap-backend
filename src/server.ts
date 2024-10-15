import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws"; // WebSocketServer from 'ws'
import config from "./config";
import app from "./app";
import { ChatService } from "./app/modules/chat/chat.service";

// Extend WebSocket interface to include roomId
interface ExtendedWebSocket extends WebSocket {
  roomId?: string; // Optional property for tracking the conversation
}

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: ExtendedWebSocket) => {
    console.log("New client connected");

    // Handle messages from the client
    ws.on("message", async (data: string) => {
      try {
        const parsedData = JSON.parse(data);

        switch (parsedData.type) {
          case "joinRoom": {
            const { user1Id, user2Id } = parsedData;
            const conversation = await ChatService.createConversation(
              parsedData
            );

            // Assign roomId to WebSocket connection
            ws.roomId = conversation.id;

            // Load all messages and send them to the user
            const conversationWithMessages =
              await ChatService.getMessagesInConversation(conversation.id);
            ws.send(
              JSON.stringify({
                type: "loadMessages",
                conversation: conversationWithMessages,
              })
            );
            break;
          }

          case "sendMessage": {
            const { chatroomId, senderId, senderName, content } = parsedData;

            // Create a new message in the conversation
            const message = await ChatService.sendMessage(parsedData);

            // Broadcast the message to all users in the same chatroom
            wss.clients.forEach((client: ExtendedWebSocket) => {
              if (
                client.roomId === chatroomId &&
                client.readyState === WebSocket.OPEN
              ) {
                client.send(
                  JSON.stringify({ type: "receiveMessage", message })
                );
              }
            });
            break;
          }

          case "typing": {
            const { typingRoomId, username } = parsedData;

            // Broadcast typing status to other users in the room
            wss.clients.forEach((client: ExtendedWebSocket) => {
              if (
                client.roomId === typingRoomId &&
                client !== ws &&
                client.readyState === WebSocket.OPEN
              ) {
                client.send(JSON.stringify({ type: "typing", username }));
              }
            });
            break;
          }

          default:
            console.log("Unknown message type:", parsedData.type);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    });

    // Handle WebSocket disconnect
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  // Graceful exit
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed gracefully");
      });
    }
    process.exit(1);
  };

  // Handle errors and rejections
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    exitHandler();
  });
}

// Start the server
main();
