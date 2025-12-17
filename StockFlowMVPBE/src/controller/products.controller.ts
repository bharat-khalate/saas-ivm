import { Request, Response } from "express";
import {
  createProduct,
  deleteProductById,
  getProductById,
  listProductsForOrg,
  updateProduct,
} from "../service/products.service.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

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
    } = req.body;

    if (!organizationId || !name || !sku) {
      return sendError(
        res,
        400,
        "organizationId, name and sku are required",
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
    });

    return sendSuccess(
      res,
      201,
      "Product created successfully",
      product,
    );
  } catch (error) {
    console.error("createProductController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

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
    return sendError(res, 500, "Internal server error", error);
  }
};

export const listProductsForOrgController = async (
  req: Request,
  res: Response,
) => {
  try {
    const organizationId = Number(req.params.organizationId);
    if (Number.isNaN(organizationId)) {
      return sendError(res, 400, "Invalid organization id");
    }

    const products = await listProductsForOrg(organizationId);
    return sendSuccess(
      res,
      200,
      "Products fetched successfully",
      products,
    );
  } catch (error) {
    console.error("listProductsForOrgController error", error);
    return sendError(res, 500, "Internal server error", error);
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
    } = req.body;

    const product = await updateProduct(id, {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    });

    return sendSuccess(
      res,
      200,
      "Product updated successfully",
      product,
    );
  } catch (error) {
    console.error("updateProductController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProductById(id);
    return sendSuccess(res, 200, "Product deleted successfully", null);
  } catch (error) {
    console.error("deleteProductController error", error);
    return sendError(res, 500, "Internal server error", error);
  }
};


