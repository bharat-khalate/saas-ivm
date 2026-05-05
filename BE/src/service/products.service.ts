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
  language?: string;
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
  language?: string;
}

/**
 * Creates a new product record.
 * @param {CreateProductInput} data - Product create payload.
 * @returns {Promise<Product>} Created product.
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
/**
 * Finds one product by product id.
 * @param {number} productId - Product identifier.
 * @returns {Promise<Product | null>} Product or null.
 */
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

/**
 * Finds product by composite organization + sku key.
 * @param {number} organizationId - Organization identifier.
 * @param {string} sku - Product sku.
 * @returns {Promise<Product | null>} Product or null.
 */
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
/**
 * Finds one product by sku.
 * @param {string} sku - Product sku.
 * @returns {Promise<Product | null>} Product or null.
 */
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
/**
 * Returns paginated products for an organization.
 * @param {number} organizationId - Organization identifier.
 * @param {PaginationValues} paginationConfig - Pagination configuration.
 * @returns {Promise<{ products: Product[]; total: number }>} Paginated products and total count.
 */
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
/**
 * function that fetches all the low stock products
 * @returns {Promise<{User,Product}[]>}
 */
export const getLowStockProducts = async () => {
  const products: Product[] = await prisma.$queryRaw`
    SELECT * FROM products
    WHERE is_active = true
    AND low_stock_threshold IS NOT NULL
    AND quantity_on_hand <= low_stock_threshold
  `;

  const grouped = products.reduce((acc, product) => {
    const orgId = product.organizationId;

    if (!acc[orgId]) {
      acc[orgId] = [];
    }

    acc[orgId].push(product);
    return acc;
  }, {} as Record<number, Product[]>);

  const result = await Promise.all(
    Object.entries(grouped).map(async ([orgId, products]) => {
      const user = await prisma.user.findUnique({
        where: { userId: Number(orgId) },
      });

      return {
        user,
        products,
      };
    })
  );

  return result;
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




/**
 * Updates product fields by id.
 * @param {number} productId - Product identifier.
 * @param {UpdateProductInput} data - Partial product fields to update.
 * @returns {Promise<Product>} Updated product.
 */
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
