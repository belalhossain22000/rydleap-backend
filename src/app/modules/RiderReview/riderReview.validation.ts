import { z } from 'zod';

export const RiderReviewValidationSchema = z.object({
  rideId: z.string().nonempty("Ride ID is required"), 
  riderId: z.string().nonempty("Rider ID is required"), 
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"), 
  comment: z.string().optional(),
});