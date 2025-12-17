import { prisma } from "../db/dbConfig.js";

export interface CreateProductInput {
  organizationId: number;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  description?: string;
  quantityOnHand?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export const createProduct = async (data: CreateProductInput) => {
  return prisma.product.create({
    data: {
      organizationId: data.organizationId,
      name: data.name,
      sku: data.sku,
      description: data.description,
      quantityOnHand: data.quantityOnHand,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice,
      lowStockThreshold: data.lowStockThreshold,
    },
  });
};

export const getProductById = async (productId: string) => {
  return prisma.product.findUnique({
    where: { productId },
  });
};

export const getProductBySkuForOrg = async (
  organizationId: number,
  sku: string,
) => {
  return prisma.product.findUnique({
    where: {
      organizationId_sku: {
        organizationId,
        sku,
      },
    },
  });
};

export const listProductsForOrg = async (organizationId: number) => {
  return prisma.product.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateProduct = async (
  productId: string,
  data: UpdateProductInput,
) => {
  return prisma.product.update({
    where: { productId },
    data,
  });
};

export const deleteProductById = async (productId: string) => {
  return prisma.product.delete({
    where: { productId },
  });
};


