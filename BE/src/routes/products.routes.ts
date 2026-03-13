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
import saveFile from "../interceptor/fileSaver.js"
import multer from "multer";


const router = Router();


const upload = multer();
router.use(authMiddleware);

// /api/products
router.post("/", upload.single('file'), saveFile, validateRequest(ProductSchema), createProductController);
router.get("/:id", getProductByIdController);
router.get("/search/:organizationId", listProductsBySkuOrName);
router.patch("/:id", validateRequest(UpdateProductSchema), updateProductController);
router.delete("/:id", deleteProductController);

// /api/products/organization/:organizationId
router.get(
  "/organization/:organizationId",
  listProductsForOrgController,
);

export default router;


