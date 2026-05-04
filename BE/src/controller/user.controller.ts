import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  listUsers,
  deleteUserById,
} from "../service/user.service.js";
import { signJwt, verifyJwtIgnoreExpiration } from "../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
/**
 * Removes sensitive fields before returning user payloads.
 * @param {any} user - User object that may include sensitive fields.
 * @returns {any} User object without password field.
 */
const toSafeUser = (user: any) => {
  if (!user) return user;
  // remove password field from response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest;
};

/**
 * Registers a new user and returns an auth token.
 * @param {Request} req - Express request containing registration payload.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with user and token.
 */
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

/**
 * Authenticates a user using email/password and returns token.
 * @param {Request} req - Express request containing login payload.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with user and token.
 */
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

/**
 * Issues a fresh token from an existing bearer token.
 * @param {Request} req - Express request with bearer token header.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with refreshed token.
 */
export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyJwtIgnoreExpiration(token);
    if (!payload) {
      return sendError(res, 401, "Invalid token");
    }

    const newToken = signJwt({ userId: payload.userId, email: payload.email });
    return sendSuccess(res, 200, "Token refreshed", { token: newToken });
  } catch (error) {
    console.error("refreshTokenController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};

/**
 * Returns one user by numeric identifier.
 * @param {Request} req - Express request with user id path param.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with user data.
 */
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

/**
 * Returns all users.
 * @param {Request} _req - Express request (unused).
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with user list.
 */
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

/**
 * Deletes one user by numeric identifier.
 * @param {Request} req - Express request with user id path param.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response confirming deletion.
 */
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


