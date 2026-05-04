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
import { TEXT } from "../constants/text.js";
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
        req.t("user.fieldsRequiredMessage"),
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return sendError(res, 409, req.t("user.userExists"));
    }

    const hashed = await hashPassword(password);
    const user = await createUser({
      email,
      password: hashed,
      organisationName,
    });
    const token = signJwt({ userId: user.userId, email: user.email });

    return sendSuccess(res, 201, req.t("auth.registerSuccess"), {
      user: toSafeUser(user),
      token,
    });
  } catch (error) {
    console.error("registerUserController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("common.commonErrorMessage"));
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, req.t("auth.authFieldsRequired"));
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return sendError(res, 401, req.t("auth.invalidCredentials"));
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return sendError(res, 401, req.t("auth.invalidCredentials"));
    }

    const token = signJwt({ userId: user.userId, email: user.email });
    return sendSuccess(res, 200, req.t("auth.loginSuccess"), {
      user: toSafeUser(user),
      token,
    });
  } catch (error) {
    console.error("loginUserController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage, error"));
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, req.t("auth.tokenMissingMessage"));
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyJwtIgnoreExpiration(token);
    if (!payload) {
      return sendError(res, 401, req.t("auth.invalidToken"));
    }

    const newToken = signJwt({ userId: payload.userId, email: payload.email });
    return sendSuccess(res, 200, req.t("auth.tokenRefreshed"), { token: newToken });
  } catch (error) {
    console.error("refreshTokenController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("common.commonErrorMessage"));
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return sendError(res, 400, req.t("user.invalidUserIdMessage"));
    }

    const user = await getUserById(id);
    if (!user) {
      return sendError(res, 404, req.t("user.userNotFoundMessage"));
    }

    return sendSuccess(res, 200, req.t("user.fetchSuccess"), toSafeUser(user));
  } catch (error) {
    console.error("getUserByIdController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("common.commonErrorMessage"));
  }
};

export const listUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await listUsers();
    return sendSuccess(
      res,
      200,
      _req.t("user.fetchSuccess"),
      users.map(toSafeUser),
    );
  } catch (error) {
    console.error("listUsersController error", error);
    return sendError(res, 500, _req.t("common.commonErrorMessage"), _req.t("common.commonErrorMessage"));
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return sendError(res, 400, req.t("user.invalidUserIdMessage"));
    }

    await deleteUserById(id);
    return sendSuccess(res, 200, req.t("user.userDeleted"), null);
  } catch (error) {
    console.error("deleteUserController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("common.commonErrorMessage"));
  }
};


