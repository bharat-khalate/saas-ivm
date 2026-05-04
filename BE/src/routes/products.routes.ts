import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  listProductsBySkuOrName,
  listProductsForOrgController,
  updateProductController,
} from "../controller/products.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";
import { validateRequest } from "../interceptor/requestValidator.js";
import { ProductSchema, UpdateProductSchema } from "../validator/product.validator.js";
import saveFile from "../interceptor/fileSaver.js";
import multer from "multer";

const router = Router();

const upload = multer();
router.use(authMiddleware);

/**
 * @swagger
 * tags: 
 *  - name: Products
 *    description: Manage Products
 */

/**
 * @swagger
 * /products: 
 *  post: 
 *    summary: Create a New Product
 *    tags:
 *      - Products
 *    security: 
 *      - bearerAuth: []
 *    requestBody: 
 *      required: true 
 *      content: 
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required: [file, productId, organizationId, name, sku, description, quantityInHand, costPrice, sellingPrice, lowStockThreshold, categoryName]
 *            properties: 
 *              file:
 *                type: string
 *                format: binary
 *              productId:
 *                type: string
 *              organizationId: 
 *                type: string
 *                description: Organization Id should exist in db
 *              name: 
 *                type: string
 *              sku: 
 *                type: string
 *              description:
 *                type: string
 *              quantityInHand:
 *                type: string
 *              costPrice: 
 *                type: string
 *              sellingPrice: 
 *                 type: string
 *              lowStockThreshold:
 *                  type: string
 *              categoryName:
 *                  type: string
 *                  description: category should exist in db 
 *    responses:
 *      200: 
 *        description: Product Created Successfully
 */
router.post(
  "/",
  upload.single("file"),
  saveFile,
  validateRequest(ProductSchema),
  createProductController,
);
/**
 * @swagger
 * /products/{id}:
 *  get:
 *    summary: Fetch product by id
 *    tags:
 *      - Products
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Product fetched successfully
 */
router.get("/:id", getProductByIdController);
/**
 * @swagger
 * /products/search/{organizationId}:
 *  get:
 *    summary: Search products by sku or name for an organization
 *    tags:
 *      - Products
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: organizationId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Products fetched successfully
 */
router.get("/search/:organizationId", listProductsBySkuOrName);
/**
 * @swagger
 * /products/{id}:
 *  patch:
 *    summary: Update product by id
 *    tags:
 *      - Products
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: false
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *              name:
 *                type: string
 *              sku:
 *                type: string
 *              description:
 *                type: string
 *              quantityInHand:
 *                type: string
 *              costPrice:
 *                type: string
 *              sellingPrice:
 *                type: string
 *              lowStockThreshold:
 *                type: string
 *              categoryName:
 *                type: string
 *    responses:
 *      200:
 *        description: Product updated successfully
 */
router.patch(
  "/:id",
  upload.single("file"),
  saveFile,
  validateRequest(UpdateProductSchema),
  updateProductController,
);
/**
 * @swagger
 * /products/{id}:
 *  delete:
 *    summary: Delete product by id
 *    tags:
 *      - Products
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Product deleted successfully
 */
router.delete("/:id", deleteProductController);

// /api/products/organization/:organizationId
/**
 * @swagger
 * /products/organization/{organizationId}:
 *  get:
 *    summary: Fetch products for organization
 *    tags:
 *      - Products
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: organizationId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Products fetched successfully
 */
router.get(
  "/organization/:organizationId",
  listProductsForOrgController,
);

export default router;


