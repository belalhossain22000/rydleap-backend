import { z } from "zod";

// Enum for RideStatus
const RideStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "REJECTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);
// Zod schema for updating a Ride
export const updateRideValidationSchema = z.object({
    pickupLat: z.number().min(-90).max(90, "Invalid latitude value").optional(),
    pickupLng: z.number().min(-180).max(180, "Invalid longitude value").optional(),
    destinationLat: z.number().min(-90).max(90, "Invalid latitude value").optional(),
    destinationLng: z.number().min(-180).max(180, "Invalid longitude value").optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    status: RideStatusEnum.optional(),
  });
  
  