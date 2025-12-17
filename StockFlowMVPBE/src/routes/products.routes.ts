import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  listProductsForOrgController,
  updateProductController,
} from "../controller/products.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// /api/products
router.post("/", createProductController);
router.get("/:id", getProductByIdController);
router.patch("/:id", updateProductController);
router.delete("/:id", deleteProductController);

// /api/products/organization/:organizationId
router.get(
  "/organization/:organizationId",
  listProductsForOrgController,
);

export default router;


