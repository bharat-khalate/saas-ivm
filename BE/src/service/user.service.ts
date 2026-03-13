import { prisma } from "../db/dbConfig.js";

export interface CreateUserInput {
  email: string;
  password: string;
  organisationName: string;
}

export const createUser = async (data: CreateUserInput) => {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      organisationName: data.organisationName,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { userId },
  });
};

export const listUsers = async () => {
  return prisma.user.findMany();
};

export const deleteUserById = async (userId: number) => {
  return prisma.user.delete({
    where: { userId },
  });
};


