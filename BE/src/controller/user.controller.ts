import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  listUsers,
  deleteUserById,
} from "../service/user.service.js";
import { signJwt } from "../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
const toSafeUser = (user: any) => {
  if (!user) return user;
  // remove password field from response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
};

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { email, password, organisationName } = req.body;

    if (!email || !password || !organisationName) {
      return sendError(
        res,
        400,
        "email, password and organisationName are required",
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return sendError(res, 409, "User already exists");
    }

    const hashed = await hashPassword(password);
    const user = await createUser({
      email,
      password: hashed,
      organisationName,
    });
    const token = signJwt({ userId: user.userId, email: user.email });

    return sendSuccess(res, 201, "User registered successfully", {
      user: toSafeUser(user),
      token,
    });
  } catch (error) {
    console.error("registerUserController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "email and password are required");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return sendError(res, 401, "Invalid credentials");
    }

    const token = signJwt({ userId: user.userId, email: user.email });
    return sendSuccess(res, 200, "Login successful", {
      user: toSafeUser(user),
      token,
    });
  } catch (error) {
    console.error("loginUserController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return sendError(res, 400, "Invalid user id");
    }

    const user = await getUserById(id);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, "User fetched successfully", toSafeUser(user));
  } catch (error) {
    console.error("getUserByIdController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};

export const listUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await listUsers();
    return sendSuccess(
      res,
      200,
      "Users fetched successfully",
      users.map(toSafeUser),
    );
  } catch (error) {
    console.error("listUsersController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return sendError(res, 400, "Invalid user id");
    }

    await deleteUserById(id);
    return sendSuccess(res, 200, "User deleted successfully", null);
  } catch (error) {
    console.error("deleteUserController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};


