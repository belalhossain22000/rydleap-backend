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

// social login
const socialLogin = async (payload: any) => {
  // Check if the user exists in the database
  let user = await prisma.user.findUnique({
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
  } else {
    user = await prisma.user.create({
      data: {
        ...payload,
      },
    });
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
    where: whereConditions,
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
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// update profile
const updateProfile = async (user: IUser, payload: IUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
      id: user.id,
    },
  });
};

const updateUserIntoDb = async (payload: IUser, id: string) => {
  // Retrieve the existing user info
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  // Update the user with the provided payload
  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      status: payload.status || userInfo.status,
      role: payload.role || userInfo.role,
      updatedAt: new Date(),
    },
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  updateProfile,
  updateUserIntoDb,
  socialLogin,
};
