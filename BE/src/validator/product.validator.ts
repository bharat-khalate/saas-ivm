import { z } from "zod";
import { validator } from "./data.validator.js"
import { toArray, toBoolean, toDate, toFloat, toInt } from "../utils/convereter.util.js";
import {
  INVALID_PRODUCT_ID,
  INVALID_ORGANIZATION_ID,
  PRODUCT_NAME_MIN_LENGTH,
  PRODUCT_NAME_NO_NUMBERS,
  SKU_NUMERIC_ONLY,
  DESCRIPTION_MAX_LENGTH,
  QUANTITY_NEGATIVE,
  COST_PRICE_NEGATIVE,
  SELLING_PRICE_NEGATIVE,
  LOW_STOCK_NEGATIVE,
  INVALID_SIZE
} from "../config/global.config.js";




export const ProductSchema = z.object({
  productId: z.preprocess(toInt, validator.optionalNumber(INVALID_PRODUCT_ID)),

  organizationId: z.preprocess(
    toInt,
    validator.number("product.invalidOrganizationMessage"),
  ),

  name: validator
    .string()
    .min(5, { message: PRODUCT_NAME_MIN_LENGTH })
    .refine((val) => !/\d/.test(val), { message: "product.numericalProductNameMessage" }),

  sku: validator
    .string()
    .regex(/^\d+$/, { message: "product.skuNonNumericMessage" }),

  description: validator
    .optionalString()
    .refine(
      (val) => !val || val.trim().split(/\s+/).length <= 200,
      { message: "product.maxLengthDescriptionMessage" },
    ),

  quantityOnHand: z.preprocess(
    toInt,
    validator.optionalNumber().refine(
      (val) => val === undefined || val > 0,
      { message: "product.quantityNegativeMessage" },
    ),
  ),

  costPrice: z.preprocess(
    toFloat,
    validator.optionalDecimal().refine(
      (val) => val === undefined || val > 0,
      { message: "product.costPriceNegativeMessage" },
    ),
  ),

  sellingPrice: z.preprocess(
    toFloat,
    validator.optionalDecimal().refine(
      (val) => val === undefined || val > 0,
      { message: "product.sellingPriceNegativeMessage" },
    ),
  ),
  lowStockThreshold: z.preprocess(
    toInt,
    validator.optionalNumber().refine(
      (val) => val === undefined || val >= 0,
      { message: "product.lowStockThresholdNegativeMessage" },
    ),
  ),
  isActive: z.preprocess(toBoolean, validator.optionalBoolean()),
  isFeatured: z.preprocess(toBoolean, validator.optionalBoolean()),
  createdAt: z.preprocess(toDate, validator.optionalDate()),
  updatedAt: z.preprocess(toDate, validator.optionalDate()),
  categoryName: validator.string(),
  fileUrl: validator.string(),
  selectedSizes: z.preprocess(
    toArray,
    validator.list("product.invalidSizeMessage"),
  )
    .optional()
    .default([]),
});

// For updates, all fields are optional; product id comes from the route param.
export const UpdateProductSchema = ProductSchema.partial();

// Example usage
// const parsed = ProductSchema.parse(req.body);

//Invalid {input} passed
// Name, SKU

//{field} must have numeric value