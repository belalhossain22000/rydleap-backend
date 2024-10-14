import multer from "multer";
import path from "path";
import prisma from "../shared/prisma";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join( "/var/www/uploads"));
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload single image
const uploadSingleImage = upload.single("singleImage");

// upload multiple image
const uploadRiderVehicleInfo = upload.fields([
  { name: "vehicleRegistrationImage", maxCount: 1 },
  { name: "vehicleInsuranceImage", maxCount: 1 },
  { name: "drivingLicenceImage", maxCount: 1 },
]);

export const fileUploader = {
  upload,
  uploadSingleImage,
  uploadRiderVehicleInfo,
};
