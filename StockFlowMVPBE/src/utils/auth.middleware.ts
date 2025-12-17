import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "./jwt.util.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyJwt(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  (req as any).userId = payload.userId;
  (req as any).userEmail = payload.email;

  return next();
};


