import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "./jwt.util.js";
import { sendError } from "./response.util.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyJwt(token);

  if (!payload) {
    return sendError(res, 401, "Invalid or expired token");
  }

  (req as any).userId = payload.userId;
  (req as any).userEmail = payload.email;

  return next();
};


