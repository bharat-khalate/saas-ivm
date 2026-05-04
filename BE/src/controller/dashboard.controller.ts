import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response.util.js";
import { getPaginationValues, PaginationValues } from "../utils/pagination.helper.js";
import { getDashBoardValues } from "../service/dashboard.service.js";

/**
 * Returns dashboard metrics and low stock products for organization.
 * @param {Request} req - Express request with auth context and pagination query.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with dashboard payload.
 */
export const getDashboardController = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).userId as number;
    const paginationConig: PaginationValues = getPaginationValues(req.query);
    const { lowStockItems, total, meta, totalQuantity } = await getDashBoardValues(organizationId, paginationConig);
    return sendSuccess(res, 200, "Dashboard data fetched successfully", {
      totalProducts: total,
      totalQuantity,
      lowStockItems,
      meta
    });
  } catch (error) {
    console.error("getDashboardController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};


