// import { Request } from "express";
// import ApiError from "../../errors/ApiErrors";
// import httpStatus from "http-status";
// import config from "../../../config";
// import prisma from "../../../shared/prisma";

// const createRiderVehicleInfoIntoDb = async (req: Request) => {
//   const files = req.files as any;
//   if (!files.vehicleRegistrationImage && !files.vehicleInsuranceImage) {
//     throw new ApiError(httpStatus.NOT_FOUND, "No files uploaded");
//   }

//   const vehicleInfo = JSON.parse(req.body.body);

//   if (!vehicleInfo.riderId) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Rider ID is required");
//   }
//   const rider = await prisma.rider.findUnique({
//     where: { id: vehicleInfo.riderId },
//   });
//   if (!rider) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
//   }

//   const vehicleRegistrationImage = files?.vehicleRegistrationImage?.map(
//     (file: any) => ({
//       url: `${config.backend_base_url}/uploads/${
//         rider.name + file.originalname
//       }`,
//     })
//   );
//   const vehicleInsuranceImage = files.vehicleInsuranceImage.map(
//     (file: any) => ({
//       url: `${config.backend_base_url}/uploads/${
//         rider.name + file.originalname
//       }`,
//     })
//   );
//   const vehicleInfoImages = {
//     vehicleRegistrationImage,
//     vehicleInsuranceImage,
//   };

//   const vehicleInfoData = {
//     ...vehicleInfo,
//     ...vehicleInfoImages,
//   };
//   const result = await prisma.riderVehicleInfo.create({
//     data: vehicleInfoData,
//   });
//   return result;
// };

// export const VehicleInfoService = {
//   createRiderVehicleInfoIntoDb,
// };
