import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  email: string;
  name?: string;
  userName?: string;
  phoneNumber?: string;
  profileImage?: string;
  licensesImage?: string;
  isDeleted?: boolean;
  password: string;
  role: "ADMIN" | "RIDER" | "USER";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
