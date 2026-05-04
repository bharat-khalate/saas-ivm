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
}

/**
 * Creates a new product record.
 * @param {CreateProductInput} data - Product create payload.
 * @returns {Promise<Product>} Created product.
 */
export const createProduct = async (data: CreateProductInput) => {
  const product = await prisma.product.create({ 
    data: {
      organizationId: data.organizationId,
      name: data.name,
      sku: data.sku,
      description: data.description,
      quantityOnHand: data.quantityOnHand,
      costPrice: data.costPrice,
      sellingPrice: data.sellingPrice,
      lowStockThreshold: data.lowStockThreshold,
      fileUrl: data.fileUrl,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      categoryName: data.categoryName,
      selectedSizes: data.selectedSizes
    },
  });
  return product;
};

/**
 * Finds one product by product id.
 * @param {number} productId - Product identifier.
 * @returns {Promise<Product | null>} Product or null.
 */
export const getProductById = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: { productId },
  });
  return product;
};

/**
 * Finds product by composite organization + sku key.
 * @param {number} organizationId - Organization identifier.
 * @param {string} sku - Product sku.
 * @returns {Promise<Product | null>} Product or null.
 */
export const getProductBySkuForOrg = async (
  organizationId: number,
  sku: string,
) => {
  const product = await prisma.product.findUnique({
    where: {
      organizationId_sku: {
        organizationId,
        sku,
      },
    },
  });
  return product;
};



/**
 * Finds one product by sku.
 * @param {string} sku - Product sku.
 * @returns {Promise<Product | null>} Product or null.
 */
export const getProductBySku = async (sku: string) => {
  const product = await prisma.product.findFirst({
    where: { sku },
  });
  return product;
};

/**
 * Returns paginated products for an organization.
 * @param {number} organizationId - Organization identifier.
 * @param {PaginationValues} paginationConfig - Pagination configuration.
 * @returns {Promise<{ products: Product[]; total: number }>} Paginated products and total count.
 */
export const listProductsForOrg = async (organizationId: number, paginationConfig: PaginationValues) => {
  const { skip, pageSize } = paginationConfig;
  const products = await prisma.product.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
  });
  const total = await prisma.product.count({
    where: { organizationId },
  });
  return { products, total };
};




/**
 * Returns paginated products filtered by sku or name.
 * @param {number} organizationId - Organization identifier.
 * @param {PaginationValues} paginationConfig - Pagination configuration.
 * @param {string} searchValues - Search text for name/sku.
 * @returns {Promise<{ products: Product[]; total: number }>} Filtered products and total count.
 */
export const fetchProductsBySkuOrName = async (
  organizationId: number,
  paginationConfig: PaginationValues,
  searchValues: string
) => {
  const { skip, pageSize } = paginationConfig;

  // Use an OR condition to match either name or sku
  const products: Product[] = await prisma.product.findMany({
    where: {
      organizationId,
      OR: [
        { name: { contains: searchValues, mode: "insensitive" } }, // case-insensitive search for name
        { sku: { contains: searchValues } }    // case-insensitive search for sku
      ],
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
    distinct: ['productId'], // Ensure there are no duplicates based on the product's unique ID
  });

  // Get the total number of matching records (without pagination applied)
  const total = await prisma.product.count({
    where: {
      organizationId,
      OR: [
        { name: { contains: searchValues, mode: "insensitive" } },
        { sku: { contains: searchValues } }
      ],
    },
  });

  return { products, total };
};




/**
 * Updates product fields by id.
 * @param {number} productId - Product identifier.
 * @param {UpdateProductInput} data - Partial product fields to update.
 * @returns {Promise<Product>} Updated product.
 */
export const updateProduct = async (
  productId: number,
  data: UpdateProductInput,
) => {
  const product = await prisma.product.update({
    where: { productId },
    data,
  });
  return product;
};

/**
 * Deletes one product by id.
 * @param {number} productId - Product identifier.
 * @returns {Promise<Product>} Deleted product.
 */
export const deleteProductById = async (productId: number) => {
  const product = await prisma.product.delete({
    where: { productId },
  });
  return product;
};


