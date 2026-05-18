import { prisma } from "../db/dbConfig.js";
import { requestLogger } from "../logger/logger.js";

export interface CreateUserInput {
  email: string;
  password: string;
  organisationName: string;
}

/**
 * Creates a user record.
 * @param {CreateUserInput} data - User fields for record creation.
 * @returns {Promise<import("../../generated/prisma/index.js").User>} Created user.
 */
export const createUser = async (data: CreateUserInput) => {
  requestLogger.info("User service- started creating user ind db", {
    "user data:": data
  })
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      organisationName: data.organisationName,
    },
  });
};

/**
 * Finds one user by unique email.
 * @param {string} email - User email.
 * @returns {Promise<import("../../generated/prisma/index.js").User | null>} User or null.
 */
export const getUserByEmail = async (email: string) => {
  requestLogger.info("User service- started fetching user from db by email", {
    "user email:": email
  })
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Finds one user by id.
 * @param {number} userId - User identifier.
 * @returns {Promise<import("../../generated/prisma/index.js").User | null>} User or null.
 */
export const getUserById = async (userId: number) => {
  requestLogger.info("User service- started fetching user from db by id", {
    "user email:": userId
  })
  return prisma.user.findUnique({
    where: { userId },
  });
};

/**
 * Returns all users.
 * @returns {Promise<import("../../generated/prisma/index.js").User[]>} User list.
 */
export const listUsers = async () => {
  requestLogger.info("User service- started fetching all users from db");
  return prisma.user.findMany();
};

/**
 * Deletes one user by id.
 * @param {number} userId - User identifier.
 * @returns {Promise<import("../../generated/prisma/index.js").User>} Deleted user.
 */
export const deleteUserById = async (userId: number) => {
  requestLogger.info("User service- started deleting user from db by id", {
    "user id:": userId
  })
  return prisma.user.delete({
    where: { userId },
  });
};


