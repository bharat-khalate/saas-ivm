import { PaginationValues } from "../utils/pagination.helper.js";
import { prisma } from "../db/dbConfig.js";
import { getOrCreateSettingsForOrg } from "./settings.service.js";
import { Product } from "../../generated/prisma/index.js";





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


export const getTotalProductsForOrg = async (organizationId: number) => {
    return prisma.product.count({
        where: { organizationId },
    });
}   