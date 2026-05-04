import { Request, Response } from "express";
import {
  createProduct,
  deleteProductById,
  fetchProductsBySkuOrName,
  getProductById,
  getProductBySkuForOrg,
  listProductsForOrg,
  updateProduct,
} from "../service/products.service.js";
import { sendSuccess, sendError } from "../utils/response.util.js";
import { getPaginationValues, PaginationValues } from "../utils/pagination.helper.js";
import { TEXT } from "../constants/text.js";

/**
 * Creates a product for the current organization.
 * @param {Request} req - Express request containing product payload.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with created product.
 */
export const createProductController = async (req: Request, res: Response) => {
  try {
    const {
      organizationId,
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      isFeatured,
      isActive,
      fileUrl,
      categoryName,
      selectedSizes
    } = req.body;


    const skuInDb = await getProductBySkuForOrg(organizationId, sku, req.language);
    if (skuInDb != null) {
      return sendError(
        res,
        400,
        req.t("product.duplicateSkuMessage"),
      );
    }

    const product = await createProduct({
      organizationId,
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      isFeatured,
      isActive,
      fileUrl,
      categoryName,
      selectedSizes,
    });

    return sendSuccess(
      res,
      201,
      req.t("product.productCreatedMessage"),
      product,
    );
  } catch (error: any) {
    console.error("createProductController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("product.productCreateFailedMessage"));
  }
};

/**
 * Returns one product by id.
 * @param {Request} req - Express request with product id path param.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with product data.
 */
export const getProductByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const product = await getProductById(parseInt(id), req.language);

    if (!product) {
      return sendError(res, 404, req.t("product.productNotFoundMessage"));
    }

    return sendSuccess(
      res,
      200,
      req.t("product.productFetchMessage"),
      product,
    );
  } catch (error) {
    console.error("getProductByIdController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("product.productFetchFailedMessage"));
  }
};

/**
 * Returns paginated products for an organization.
 * @param {Request} req - Express request with organization id and pagination query.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with product list and meta.
 */
export const listProductsForOrgController = async (
  req: Request,
  res: Response,
) => {
  try {
    const paginationConfig: PaginationValues = getPaginationValues(req.query);
    const organizationId = Number(req.params.organizationId);
    if (Number.isNaN(organizationId)) {
      return sendError(res, 400, req.t("product.invalidOrganizationMessage"));
    }
    const { products, total } = await listProductsForOrg(organizationId, paginationConfig, req.language);
    const totalPages = Math.ceil(total / paginationConfig.pageSize);

    return sendSuccess(
      res,
      200,
      req.t("product.productFetchMessage"),
      { products, meta: { total, page: paginationConfig.page, pageSize: paginationConfig.pageSize, totalPages } },
    );
  } catch (error) {
    console.error("listProductsForOrgController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("product.productFetchFailedMessage"));
  }
};



/**
 * Returns paginated products filtered by sku or name.
 * @param {Request} req - Express request with search and pagination params.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with filtered products and meta.
 */
export const listProductsBySkuOrName = async (
  req: Request,
  res: Response,
) => {
  try {
    const { searchValue } = req.query as { searchValue: string };
    const paginationConfig: PaginationValues = getPaginationValues(req.query);
    const organizationId = Number(req.params.organizationId);
    if (Number.isNaN(organizationId)) {
      return sendError(res, 400, req.t("product.invalidOrganizationMessage"));
    }

    const { products, total } = await fetchProductsBySkuOrName(organizationId, paginationConfig, searchValue, req.language);
    const totalPages = Math.ceil(total / paginationConfig.pageSize);

    return sendSuccess(
      res,
      200,
      "Products fetched successfully",
      { products, meta: { total, page: paginationConfig.page, pageSize: paginationConfig.pageSize, totalPages } },
    );
  } catch (error) {
    console.error("listProductsForOrgController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("product.productFetchFailedMessage"));
  }
};

/**
 * Updates a product by id.
 * @param {Request} req - Express request with product id and fields to update.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response with updated product.
 */
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      fileUrl,
      isActive,
      isFeatured,
      selectedSizes,
      categoryName,
    } = req.body;



    const product = await updateProduct(parseInt(id), {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      fileUrl,
      isActive,
      isFeatured,
      selectedSizes,
      categoryName,
    });

    return sendSuccess(
      res,
      200,
      req.t("product.productUpdatedMessage"),
      product,
    );
  } catch (error) {
    console.error("updateProductController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("product.productUpdateFailedMessage"));
  }
};

/**
 * Deletes a product by id.
 * @param {Request} req - Express request with product id path param.
 * @param {Response} res - Express response.
 * @returns {Promise<Response>} JSON response confirming deletion.
 */
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProductById(parseInt(id));
    return sendSuccess(res, 200, "Product deleted successfully", null);
  } catch (error) {
    console.error("deleteProductController error", error);
    return sendError(res, 500, req.t("common.commonErrorMessage"), req.t("product.productDeleteFailedMessage"));
  }
};


