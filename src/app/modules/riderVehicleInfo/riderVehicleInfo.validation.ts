import { z } from "zod";

const fileSchema = z.object({
  originalname: z.string().min(1, "File name is required."),
  mimetype: z.string().startsWith("image/", "Must be an image file."),
});
const createRiderVehicleInfoSchema = z.object({
  // vehicleInsuranceImage: z
  //   .array(fileSchema)
  //   .min(1, "At least one insurance image is required."),
  // vehicleRegistrationImage: z
  //   .array(fileSchema)
  //   .min(1, "At least one registration image is required."),
  body: z.object({
    vehicleMake: z.string().min(1, "Vehicle make is required."),
    vehicleModel: z.string().min(1, "Vehicle model is required."),
    vehicleYear: z.string().min(1, "Vehicle year is required."),
    vehicleColor: z.string().min(1, "Vehicle color is required."),
    vehicleLicensePlateNumber: z
      .string()
      .min(1, "Vehicle license plate is required."),
    riderId: z
      .string()
      .length(24, "Invalid rider ID format.")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid rider ID format."),
  }),
});

export const RiderVehicleValidationSchema = {
  createRiderVehicleInfoSchema,
};
