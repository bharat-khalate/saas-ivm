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


    const skuInDb = await getProductBySkuForOrg(organizationId, sku);
    if (skuInDb != null) {
      return sendError(
        res,
        400,
        "Product Already Exist for this SKU",
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
      "Product created successfully",
      product,
    );
  } catch (error: any) {
    console.error("createProductController error", error);
    return sendError(res, 500, "Internal Server Error", "Failed To Create Product");
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const product = await getProductById(parseInt(id));

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    return sendSuccess(
      res,
      200,
      "Product fetched successfully",
      product,
    );
  } catch (error) {
    console.error("getProductByIdController error", error);
    return sendError(res, 500, "Internal server error", "Failed To get Product")
  }
};

export const listProductsForOrgController = async (
  req: Request,
  res: Response,
) => {
  try {
    const paginationConfig: PaginationValues = getPaginationValues(req.query);
    const organizationId = Number(req.params.organizationId);
    if (Number.isNaN(organizationId)) {
      return sendError(res, 400, "Invalid organization id");
    }
    const { products, total } = await listProductsForOrg(organizationId, paginationConfig);
    const totalPages = Math.ceil(total / paginationConfig.pageSize);

    return sendSuccess(
      res,
      200,
      "Products fetched successfully",
      { products, meta: { total, page: paginationConfig.page, pageSize: paginationConfig.pageSize, totalPages } },
    );
  } catch (error) {
    console.error("listProductsForOrgController error", error);
    return sendError(res, 500, "Internal server error", "Failed To Get Product");
  }
};



export const listProductsBySkuOrName = async (
  req: Request,
  res: Response,
) => {
  try {
    const { searchValue } = req.query as { searchValue: string };
    const paginationConfig: PaginationValues = getPaginationValues(req.query);
    const organizationId = Number(req.params.organizationId);
    if (Number.isNaN(organizationId)) {
      return sendError(res, 400, "Invalid organization id");
    }

    const { products, total } = await fetchProductsBySkuOrName(organizationId, paginationConfig, searchValue);
    const totalPages = Math.ceil(total / paginationConfig.pageSize);

    return sendSuccess(
      res,
      200,
      "Products fetched successfully",
      { products, meta: { total, page: paginationConfig.page, pageSize: paginationConfig.pageSize, totalPages } },
    );
  } catch (error) {
    console.error("listProductsForOrgController error", error);
    return sendError(res, 500, "Internal server error", "Failed To Get Product");
  }
};

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
      "Product updated successfully",
      product,
    );
  } catch (error) {
    console.error("updateProductController error", error);
    return sendError(res, 500, "Internal server error", "Failed To Update Product");
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProductById(parseInt(id));
    return sendSuccess(res, 200, "Product deleted successfully", null);
  } catch (error) {
    console.error("deleteProductController error", error);
    return sendError(res, 500, "Internal server error", "Failed To Delete Product");
  }
};


