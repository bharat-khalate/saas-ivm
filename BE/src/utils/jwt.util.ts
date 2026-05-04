import jwt from "jsonwebtoken";
import { JWT_SECRET as JSECRET, JWT_EXPIRES_IN as JWTEXPIRY } from "../config/env.js";

const JWT_SECRET: jwt.Secret = JSECRET;
// jsonwebtoken v9 types restrict expiresIn to a typed duration (StringValue) or number.
// Env vars are plain string, so we cast to the allowed type with a safe default.
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
  (JWTEXPIRY as jwt.SignOptions["expiresIn"]) || "1h";

export interface JwtPayload {
  userId: number;
  email: string;
}

export const signJwt = (payload: JwtPayload) => {
  console.log("expiration:", JWT_EXPIRES_IN);
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyJwtIgnoreExpiration = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as JwtPayload;
  } catch {
    return null;
  }
};


