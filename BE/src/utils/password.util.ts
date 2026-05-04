import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/env.js";

const SALT_ROUNDS = BCRYPT_SALT_ROUNDS;

export const hashPassword = async (plain: string) => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

export const comparePassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};