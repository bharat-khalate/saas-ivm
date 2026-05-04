import { Request, Response } from "express";
import {
  getOrCreateSettingsForOrg,
  upsertSettingsForOrg,
} from "../service/settings.service.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

/**
 * Fetches settings for authenticated organization, creating defaults if missing.
 * @param {Request} req - Express request for authenticated user context.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with settings.
 */
export const getSettingsController = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).userId as number;
    if (!organizationId) {
      return sendError(res, 401, req.t("user.userNotAuthenticatedMessage"));
    }
    const settings = await getOrCreateSettingsForOrg(organizationId);
    return sendSuccess(
      res,
      200,
      req.t("settings.settingsFetchMessage"),
      settings,
    );
  } catch (error) {
    console.error("getSettingsController error", error);
    const errorMessage = error instanceof Error ? error.message : req.t("common.commonErrorMessage");
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("common.commonErrorMessage"));
  }
};

/**
 * Updates organization settings for authenticated user.
 * @param {Request} req - Express request with settings payload.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with updated settings.
 */
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
        req.t("settings.stockThresholdMissingMessage"),
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
        req.t("settings.invalidStockThresholdMessage"),
      );
    }

    const settings = await upsertSettingsForOrg(organizationId, value);
    return sendSuccess(
      res,
      200,
      req.t("settings.settingsUpdatedMessage"),
      settings,
    );
  } catch (error) {
    console.error("updateSettingsController error", error);
    const errorMessage = error instanceof Error ? error.message : req.t("common.commonErrorMessage");
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("common.commonErrorMessage"));
  }
};


