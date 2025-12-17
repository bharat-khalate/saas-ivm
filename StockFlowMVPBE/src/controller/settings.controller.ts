import { Request, Response } from "express";
import {
  getOrCreateSettingsForOrg,
  upsertSettingsForOrg,
} from "../service/settings.service.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

export const getSettingsController = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).userId as number;
    if (!organizationId) {
      return sendError(res, 401, "User not authenticated");
    }
    const settings = await getOrCreateSettingsForOrg(organizationId);
    return sendSuccess(
      res,
      200,
      "Settings fetched successfully",
      settings,
    );
  } catch (error) {
    console.error("getSettingsController error", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return sendError(res, 500, errorMessage, null);
  }
};

export const updateSettingsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const organizationId = (req as any).userId as number;
    const { defaultLowStockThreshold } = req.body;

    if (defaultLowStockThreshold === undefined) {
      return sendError(
        res,
        400,
        "defaultLowStockThreshold is required",
      );
    }

    const value =
      defaultLowStockThreshold === null
        ? null
        : Number(defaultLowStockThreshold);

    if (value !== null && (Number.isNaN(value) || value < 0)) {
      return sendError(
        res,
        400,
        "defaultLowStockThreshold must be a non-negative number or null",
      );
    }

    const settings = await upsertSettingsForOrg(organizationId, value);
    return sendSuccess(
      res,
      200,
      "Settings updated successfully",
      settings,
    );
  } catch (error) {
    console.error("updateSettingsController error", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return sendError(res, 500, errorMessage, null);
  }
};


