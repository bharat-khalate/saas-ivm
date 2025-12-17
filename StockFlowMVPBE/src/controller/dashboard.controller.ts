import { Request, Response } from "express";
import { prisma } from "../db/dbConfig.js";
import { getOrCreateSettingsForOrg } from "../service/settings.service.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

export const getDashboardController = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).userId as number;

    const [products, settings] = await Promise.all([
      prisma.product.findMany({
        where: { organizationId },
      }),
      getOrCreateSettingsForOrg(organizationId),
    ]);

    const totalProducts = products.length;
    const totalQuantity = products.reduce(
      (sum, p) => sum + (p.quantityOnHand ?? 0),
      0,
    );

    const defaultThreshold = settings.defaultLowStockThreshold ?? 5;

    const lowStockItems = products
      .filter((p) => {
        const threshold = p.lowStockThreshold ?? defaultThreshold;
        if (threshold == null) return false;
        return p.quantityOnHand <= threshold;
      })
      .map((p) => ({
        productId: p.productId,
        name: p.name,
        sku: p.sku,
        quantityOnHand: p.quantityOnHand,
        lowStockThreshold: p.lowStockThreshold ?? defaultThreshold,
      }));

    return sendSuccess(res, 200, "Dashboard data fetched successfully", {
      totalProducts,
      totalQuantity,
      lowStockItems,
    });
  } catch (error) {
    console.error("getDashboardController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};


