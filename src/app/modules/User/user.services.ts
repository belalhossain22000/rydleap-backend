import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import httpStatus from "http-status";
import { AuthServices } from "../Auth/auth.service";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import { Secret } from "jsonwebtoken";

// Create a new User in the database.
const createUserIntoDb = async (payload: any) => {
  const isPhoneNumberExist = await prisma.oTP.findUnique({
    where: { phoneNumber: payload.phoneNumber },
  });
  if (!isPhoneNumberExist?.phoneNumber) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Phone Number is not Verified or Not exist"
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.email}`
    );
  }
  const isUserExistWithPhoneNumber = await prisma.user.findFirst({
    where: {
      phoneNumber: payload.phoneNumber,
    },
  });

  if (isUserExistWithPhoneNumber?.phoneNumber) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.phoneNumber}`
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword, isPhoenVerified: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User creation failed");
  }

  const { password, ...withoutPasswordUser } = result;

  return withoutPasswordUser;
};

//create a new user for firebase registration
const createUserFirebase = async (payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `User already exists with this  ${payload.email}`
    );
  }

  if (payload.password) {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
    const createUser = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    const accessToken = jwtHelpers.generateToken(
      {
        id: createUser.id,
        email: createUser.email,
        role: createUser.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return accessToken;
  } else {
    const createdUserWithoutPassword = await prisma.user.create({
      data: {
        ...payload,
      },
    });
    const accessToken = jwtHelpers.generateToken(
      {
        id: createdUserWithoutPassword.id,
        email: createdUserWithoutPassword.email,
        role: createdUserWithoutPassword.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    return accessToken;
  }
};

// social login
const socialLogin = async (payload: any) => {
  // Check if the user exists in the database
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (user) {
    const accessToken = jwtHelpers.generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    return accessToken;
  }

  if (payload.password) {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
    const createUser = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    const accessToken = jwtHelpers.generateToken(
      {
        id: createUser.id,
        email: createUser.email,
        role: createUser.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return accessToken;
  } else {
    const createdUserWithoutPassword = await prisma.user.create({
      data: {
        ...payload,
      },
    });
    const accessToken = jwtHelpers.generateToken(
      {
        id: createdUserWithoutPassword.id,
        email: createdUserWithoutPassword.email,
        role: createdUserWithoutPassword.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    return accessToken;
  }
};

// reterive all users from the database
const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: {
      ...whereConditions,
      role: "USER",
    },
    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: [options.sortOrder],
          }
        : { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      locations: true,
      riderReviewsAsCustomer: true,
    },
  });

  const totalActiveUsers = await prisma.user.count({
    where: {
      role: "USER",
      status: "ACTIVE",
    },
  });

  const total = await prisma.user.count({
    where: {
      ...whereConditions,
      role: "USER",
    },
  });
  return {
    meta: {
      page,
      limit,
      total,
      totalActiveUsers,
    },
    data: result,
  };
};

const getUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// reterive all riders from the database
const getRidersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: {
      ...whereConditions,
      role: "RIDER",
    },
    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: [options.sortOrder],
          }
        : { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      locations: true,
      riderVehicleInfo: true,
      riderReviewsAsRider: true,
    },
  });

  const totalActiveDrivers = await prisma.user.count({
    where: {
      role: "RIDER",
      status: "ACTIVE",
    },
  });

  const total = await prisma.user.count({
    where: {
      ...whereConditions,
      role: "RIDER",
    },
  });
  return {
    meta: {
      page,
      limit,
      total,
      totalActiveDrivers,
    },
    data: result,
  };
};

const getRidersFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "RIDER",
    },
    select: {
      id: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getSingleUserFromDb = async (userId: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      ridesAsCustomer: {
        where: {
          status: "COMPLETED",
        },
      },
      riderReviewsAsCustomer: true,
    },
  });

  if (!userInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return userInfo;
};

const getSingleRiderFromDb = async (userId: string) => {
  const riderInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      role: "RIDER",
    },
    include: {
      riderVehicleInfo: true,
      riderReviewsAsRider: true,
      ridesAsRider: {
        where: {
          status: "COMPLETED",
        },
      },
    },
  });

  if (!riderInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
  }

  return riderInfo;
};

// update profile
const updateProfile = async (user: IUser, req: any) => {
  const files = req.file as any;

  // Find user in the database
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
      id: user.id,
    },
  });

  if (!userInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const profileData = req.body?.body ? JSON.parse(req.body.body) : {};

  const profileImage = files
    ? `${config.backend_base_url}/uploads/${files.originalname}`
    : userInfo.profileImage;

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...profileData,
      profileImage,
    },
  });

  if (!updatedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User update failed");
  }

  return updatedUser;
};

// udpate user profile by id
const updateUserIntoDb = async (payload: IUser, id: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  if (!userInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      ...payload,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User update failed");
  }
  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getUsersFromDB,
  getRidersFromDb,
  getRidersFromDB,
  updateProfile,
  updateUserIntoDb,
  socialLogin,
  getSingleUserFromDb,
  getSingleRiderFromDb,
  createUserFirebase,
};
