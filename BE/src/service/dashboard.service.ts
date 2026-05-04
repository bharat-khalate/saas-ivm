import { PaginationValues } from "../utils/pagination.helper.js";
import { prisma } from "../db/dbConfig.js";
import { getOrCreateSettingsForOrg } from "./settings.service.js";
import { Product } from "../../generated/prisma/index.js";





/**
 * Builds dashboard totals and low-stock listing payload.
 * @param {number} organizationId - Organization identifier.
 * @param {PaginationValues} paginationConfig - Pagination configuration.
 * @returns {Promise<{ lowStockItems: Product[]; total: number; meta: { total: number; page: number; pageSize: number; totalPages: number }; totalQuantity: number }>} Dashboard data.
 */
export const getDashBoardValues = async (organizationId: number, paginationConfig: PaginationValues) => {
    const overAllQuantity = await prisma.product.aggregate({
        where: { organizationId },
        _sum: {
            quantityOnHand: true,
        },
    });
    const totalQuantity = overAllQuantity._sum.quantityOnHand ?? 0;
    const { lowStockItems, total, meta } = await lowStockItemsForOrg(organizationId, paginationConfig);
    return { lowStockItems, total, meta, totalQuantity };
}


/**
 * Returns paginated low-stock products for organization.
 * @param {number} organizationId - Organization identifier.
 * @param {PaginationValues} paginationConfig - Pagination configuration.
 * @returns {Promise<{ lowStockItems: Product[]; total: number; meta: { total: number; page: number; pageSize: number; totalPages: number } }>} Low-stock list with meta.
 */
export const lowStockItemsForOrg = async (organizationId: number, paginationConfig: PaginationValues) => {
    const settings = await getOrCreateSettingsForOrg(organizationId);
    const defaultThreshold = settings.defaultLowStockThreshold ?? 5;
    const total = await getTotalProductsForOrg(organizationId);
    const lowStockItems: Product[] = await prisma.product.findMany({
        where: {
            organizationId,
            quantityOnHand: {
                gt: defaultThreshold
            }
        },
        orderBy: { createdAt: "desc" },
        skip: paginationConfig.skip,
        take: paginationConfig.pageSize,
    });
    const totalPages = Math.ceil(total / paginationConfig.pageSize);
    const meta = {
        total,
        page: paginationConfig.page,
        pageSize: paginationConfig.pageSize,
        totalPages,
    }
    return { lowStockItems, total, meta };
}


/**
 * Returns count of products for organization.
 * @param {number} organizationId - Organization identifier.
 * @returns {Promise<number>} Total product count.
 */
export const getTotalProductsForOrg = async (organizationId: number) => {
    return prisma.product.count({
        where: { organizationId },
    });
}   