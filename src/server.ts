import { Server } from "http";
import config from "./config";
import prisma from "./shared/prisma"; // Assuming prisma is already set up
import app from "./app"; // Your Express app
import { Server as SocketIOServer } from "socket.io"; // Import Socket.io

let server: Server;
let io: SocketIOServer; // Declare socket.io instance

async function startServer() {
  try {
    // Start the server
    server = app.listen(config.port, () => {
      console.log("Server is running on port ", config.port);
    });

    // Initialize Socket.io with the Express server
    io = new SocketIOServer(server, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      },
    });

    // Handle real-time connections
    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle joining a ride's room (for both drivers and riders)
      socket.on("joinRide", (rideId: string) => {
        socket.join(rideId); // Add socket to the room with rideId
        console.log(`User joined ride room: ${rideId}`);
      });

      // Handle real-time location updates from driver
      socket.on("driverLocationUpdate", (data) => {
        const { driverId, latitude, longitude, rideId } = data;
        // Broadcast updated location to the rider
        io.to(rideId).emit("updateDriverLocation", {
          driverId,
          latitude,
          longitude,
        });
        console.log(`Driver ${driverId} location updated for ride ${rideId}`);
      });

      // Handle real-time location updates from rider
      socket.on("riderLocationUpdate", (data) => {
        const { riderId, latitude, longitude, rideId } = data;
        // Broadcast updated location to the driver
        io.to(rideId).emit("updateRiderLocation", {
          riderId,
          latitude,
          longitude,
        });
        console.log(`Rider ${riderId} location updated for ride ${rideId}`);
      });

      // Handle chat messages
      socket.on("sendMessage", (data) => {
        const { senderId, rideId, message } = data;
        // Emit the message to the other party in the room
        io.to(rideId).emit("receiveMessage", { senderId, message });
        console.log(`Message from ${senderId} in ride ${rideId}: ${message}`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  } catch (error) {
    console.error("Error starting the server: ", error);
    process.exit(1); // Exit the process if the server can't start
  }
}

async function shutdownServer() {
  if (server) {
    console.info("Closing server gracefully...");

    // Close the server and Prisma connections before shutting down
    server.close(() => {
      console.info("Server closed!");

      prisma
        .$disconnect()
        .then(() => {
          console.info("Prisma disconnected");
          process.exit(0); // Gracefully exit
        })
        .catch((error) => {
          console.error("Error disconnecting Prisma: ", error);
          process.exit(1);
        });
    });
  } else {
    process.exit(1); // No server running, exit with an error
  }
}

const restartServer = async () => {
  console.info("Restarting server...");
  await shutdownServer(); 
  await main(); 
};

async function main() {
  await startServer();

  const exitHandler = async () => {
    await shutdownServer();
  };

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception: ", error);
    exitHandler();
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection: ", reason);
    exitHandler();
  });

  // Handling the server shutdown gracefully on SIGTERM and SIGINT
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down gracefully...");
    exitHandler();
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down gracefully...");
    exitHandler();
  });
}

// Starting the server
main();
