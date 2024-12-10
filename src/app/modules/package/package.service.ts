import { Package } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

// Create a new package in the database.
const createPackageIntoDb = async (payload: Package) => {
  const existingPackage = await prisma.package.findUnique({
    where: { name: payload.name },
  });
  if (existingPackage) {
    throw new ApiError(409, "Package already exists");
  }

  const result = await prisma.package.create({
    data: payload,
  });

  return result;
};

//get all packages in the database
const getAllPackagesIntoDb = async () => {
  const packages = await prisma.package.findMany();
  return packages;
};

//get package by id
const getPackageByIdIntoDb = async (id: string) => {
  const packageById = await prisma.package.findUnique({
    where: { id },
  });

  if (!packageById) {
    throw new ApiError(404, "Package not found");
  }
  return packageById;
};

//update package by id
const updatePackageByIdIntoDb = async (id: string, payload: Package) => {
  const existingPackage = await prisma.package.findMany();
  if (existingPackage.some((p) => p.name === payload.name)) {
    throw new ApiError(409, "Package already exists");
  }
  const packageToUpdate = await prisma.package.findUnique({
    where: { id },
  });

  if (!packageToUpdate) {
    throw new ApiError(404, "Package not found");
  }

  const updatedPackage = await prisma.package.update({
    where: { id },
    data: payload,
  });

  return updatedPackage;
};

//delete package by id
const deletePackageByIdIntoDb = async (id: string) => {
  const packageToDelete = await prisma.package.findUnique({
    where: { id },
  });

  if (!packageToDelete) {
    throw new ApiError(404, "Package not found");
  }

  await prisma.package.delete({
    where: { id },
  });
};

export const packageService = {
  createPackageIntoDb,
  getAllPackagesIntoDb,
  getPackageByIdIntoDb,
  updatePackageByIdIntoDb,
  deletePackageByIdIntoDb,
};
