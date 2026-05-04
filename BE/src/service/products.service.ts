import { Product } from "../../generated/prisma/index.js";
import { prisma } from "../db/dbConfig.js";
import { PaginationValues } from "../utils/pagination.helper.js";

export interface CreateProductInput {
  organizationId: number;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
  fileUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryName: string;
  selectedSizes: string[];
  language?: string; // ✅ NEW
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  description?: string;
  quantityOnHand?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
  fileUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryName?: string;
  selectedSizes?: string[];
  language?: string; // ✅ NEW
}

/**
 * Helper: apply translation fallback
 */
const applyTranslation = (product: any, language?: string) => {
  if (!language || !product?.translations?.length) return product;

  const t = product.translations[0];

  return {
    ...product,
    name: t?.name ?? product.name,
    description: t?.description ?? product.description,
  };
};

export const createProduct = async (data: CreateProductInput) => {
  const { language = "en", ...rest } = data;

  const product = await prisma.product.create({
    data: {
      ...rest,
      translations: {
        create: {
          language,
          name: data.name,
          description: data.description,
        },
      },
    },
  });

  return product;
};

export const getProductById = async (productId: number, language: string) => {
  const product = await prisma.product.findUnique({
    where: { productId },
    include: {
      translations: language
        ? { where: { language }, take: 1 }
        : false,
    },
  });

  return applyTranslation(product, language);
};

export const getProductBySkuForOrg = async (
  organizationId: number,
  sku: string,
  language: string
) => {
  const product = await prisma.product.findUnique({
    where: {
      organizationId_sku: {
        organizationId,
        sku,
      },
    },
    include: {
      translations: language
        ? { where: { language }, take: 1 }
        : false,
    },
  });

  return applyTranslation(product, language);
};

export const getProductBySku = async (sku: string, language: string) => {
  const product = await prisma.product.findFirst({
    where: { sku },
    include: {
      translations: language
        ? { where: { language }, take: 1 }
        : false,
    },
  });

  return applyTranslation(product, language);
};

export const listProductsForOrg = async (
  organizationId: number,
  paginationConfig: PaginationValues,
  language: string
) => {
  const { skip, pageSize } = paginationConfig;

  const products = await prisma.product.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
    include: {
      translations: language
        ? { where: { language }, take: 1 }
        : false,
    },
  });

  const total = await prisma.product.count({
    where: { organizationId },
  });

  return {
    products: products.map((p) => applyTranslation(p, language)),
    total,
  };
};

export const fetchProductsBySkuOrName = async (
  organizationId: number,
  paginationConfig: PaginationValues,
  searchValues: string,
  language: string
) => {
  const { skip, pageSize } = paginationConfig;

  const products: Product[] = await prisma.product.findMany({
    where: {
      organizationId,
      OR: [
        { name: { contains: searchValues, mode: "insensitive" } },
        { sku: { contains: searchValues } },
      ],
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
    distinct: ["productId"],
    include: {
      translations: language
        ? { where: { language }, take: 1 }
        : false,
    },
  });

  const total = await prisma.product.count({
    where: {
      organizationId,
      OR: [
        { name: { contains: searchValues, mode: "insensitive" } },
        { sku: { contains: searchValues } },
      ],
    },
  });

  return {
    products: products.map((p) => applyTranslation(p, language)),
    total,
  };
};

export const updateProduct = async (
  productId: number,
  data: UpdateProductInput
) => {
  const { language = "en", ...rest } = data;

  const product = await prisma.product.update({
    where: { productId },
    data: {
      ...rest,
      translations: {
        upsert: {
          where: {
            productId_language: {
              productId,
              language,
            },
          },
          update: {
            name: data.name,
            description: data.description,
          },
          create: {
            language,
            name: data.name!,
            description: data.description,
          },
        },
      },
    },
  });

  return product;
};

export const deleteProductById = async (productId: number) => {
  const product = await prisma.product.delete({
    where: { productId },
  });
  return product;
};