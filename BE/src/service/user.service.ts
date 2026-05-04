import { prisma } from "../db/dbConfig.js";

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
  return prisma.user.findUnique({
    where: { userId },
  });
};

/**
 * Returns all users.
 * @returns {Promise<import("../../generated/prisma/index.js").User[]>} User list.
 */
export const listUsers = async () => {
  return prisma.user.findMany();
};

/**
 * Deletes one user by id.
 * @param {number} userId - User identifier.
 * @returns {Promise<import("../../generated/prisma/index.js").User>} Deleted user.
 */
export const deleteUserById = async (userId: number) => {
  return prisma.user.delete({
    where: { userId },
  });
};


