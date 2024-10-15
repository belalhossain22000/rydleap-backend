import config from "../../../config";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

//create profile
const createRydleapProfileIntoDB = async (req: any) => {
  const files = req.file as any;
  const adminId = req.user.id;
  const payload = req.body?.body ? JSON.parse(req.body.body) : {};
  const isExistingProfile = await prisma.rydleapProfile.findFirst({
    where: {
      fullName: payload.fullName,
    },
  });

  if (isExistingProfile) {
    throw new ApiError(409, "This profile already exists!");
  }

  const profileData = req.body?.body ? JSON.parse(req.body.body) : {};

  const logo = files
    ? `${config.backend_base_url}/uploads/${files.originalname}`
    : null;

  const result = await prisma.rydleapProfile.create({
    data: {
      ...profileData,
      logo,
      adminId,
    },
  });
  return result;
};

//get profile
const getProfileFromDB = async () => {
  const result = await prisma.rydleapProfile.findMany({
    include: {
      admin: true,
    },
  });
  if (result.length === 0) {
    throw new ApiError(404, "Profile not found!");
  }
  return result;
};

//update profile
const updateRydleapProfileIntoDB = async (profileId: string, req: any) => {
  const files = req.file as any;
  const profile = await prisma.rydleapProfile.findUniqueOrThrow({
    where: { id: profileId },
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found!");
  }

  const profileData = req.body?.body ? JSON.parse(req.body.body) : {};

  const logo = files
    ? `${config.backend_base_url}/uploads/${files.originalname}`
    : profile.logo;

  const profileToUpdate = await prisma.rydleapProfile.update({
    where: {
      id: profileId,
    },
    data: {
      ...profileData,
      logo,
    },
  });

  if (!profileToUpdate) {
    throw new ApiError(400, "profile update failed");
  }

  return profileToUpdate;
};

//delete profile
const deleteProfileFromDB = async (profileId: string) => {
  const profile = await prisma.rydleapProfile.findUnique({
    where: { id: profileId },
  });
  if (!profile) {
    throw new ApiError(404, "profile not found");
  }

  await prisma.rydleapProfile.delete({
    where: { id: profileId },
  });
  return;
};

export const rydleapService = {
  createRydleapProfileIntoDB,
  getProfileFromDB,
  updateRydleapProfileIntoDB,
  deleteProfileFromDB,
};
