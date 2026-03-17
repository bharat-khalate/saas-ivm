import { z } from "zod";

const ONLY_ALPHA = /^[A-Za-z\s]+$/;

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email must be valid" }),
  password: z
    .string()
    .min(6, { message: "Password must be greater than 5 characters" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email must be valid" }),
  password: z
    .string()
    .min(6, { message: "Password must be greater than 5 characters" }),
  organisationName: z
    .string()
    .min(6, { message: "Organization name must be at least 6 characters" })
    .max(15, { message: "Organization name must be at most 15 characters" })
    .regex(ONLY_ALPHA, { message: "Organization name must contain only alphabets" }),
});

