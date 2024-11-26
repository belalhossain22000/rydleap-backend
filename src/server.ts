import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import config from "./config";
import app from "./app";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws/' });

  // Store active WebSocket connections
  const connections: Map<string, { ws: WebSocket; role: "RIDER" | "USER" }> =
    new Map();

  wss.on("connection", (ws: WebSocket, req) => {
    console.log("New client connected");

    // Handle initial message to register user
    ws.on("message", async (message: string) => {
      const { type, userId, role, location } = JSON.parse(message);

      switch (type) {
        case "register":
          // Register the connection
          connections.set(userId, { ws, role });
          console.log(`User ${userId} (${role}) registered`);
          break;

        case "location-update":
          // Handle location updates
          const { lat, lng } = location;

          // Save the latest location to the database
          const result = await prisma.userLocation.upsert({
            where: { userId },
            update: { locationLat: lat, locationLng: lng },
            create: { userId, locationLat: lat, locationLng: lng },
          });
          // ws.send(
          //   JSON.stringify({
          //     type: "location-update",
          //     userId,
          //     location: { lat, lng },
          //   })
          // );
          // Broadcast location update to relevant user
          const targetRole = role === "RIDER" ? "RIDER" : "USER";
          for (const [targetId, connection] of connections.entries()) {
            if (connection.role === targetRole) {
              connection.ws.send(
                JSON.stringify({
                  type: "location-update",
                  userId,
                  location: { lat, lng },
                })
              );
            }
          }
          break;

        default:
          console.log("Unknown message type");
      }
    });

    // Handle WebSocket disconnect
    ws.on("close", () => {
      for (const [userId, connection] of connections.entries()) {
        if (connection.ws === ws) {
          connections.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
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

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    exitHandler();
  });
}

main();
