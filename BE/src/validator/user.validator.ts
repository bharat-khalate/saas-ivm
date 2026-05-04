import { z } from "zod";
import { TEXT } from "../constants/text.js";

const ONLY_ALPHA = /^[A-Za-z\s]+$/;

export const LoginSchema = z.object({
  email: z.string().email({ message: TEXT.commonFieldValidation.invalidEmailMessage }),
  password: z
    .string()
    .min(6, { message: TEXT.commonFieldValidation.invalidPasswordMessage }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: TEXT.commonFieldValidation.invalidEmailMessage }),
  password: z
    .string()
    .min(6, { message: TEXT.commonFieldValidation.invalidPasswordMessage }),
  organisationName: z
    .string()
    .min(6, { message: TEXT.commonFieldValidation.shortOrgnizationNameMessage })
    .max(15, { message: TEXT.commonFieldValidation.longOrganizationNameMessage })
    .regex(ONLY_ALPHA, { message: TEXT.commonFieldValidation.alphaOrganizationNameMessage }),
});

