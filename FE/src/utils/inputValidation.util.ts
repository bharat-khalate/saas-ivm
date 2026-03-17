import type { Product } from "../services/productService"

export const validateProduct = (product: Product, requireFile: boolean = false) => {
  const errors: Record<string, string> = {}

  // Name: required, alphabetical only, min 5 chars
  if (!product.name.trim()) {
    errors.name = "Product name is required"
  } else if (!/^[A-Za-z\s]+$/.test(product.name)) {
    errors.name = "Product name must contain only letters"
  } else if (product.name.trim().length < 5) {
    errors.name = "Product name must be at least 5 characters"
  }

  // SKU: required, min 5 chars
  if (!product.sku.trim()) {
    errors.sku = "SKU is required"
  } else if (product.sku.trim().length < 5) {
    errors.sku = "SKU must be at least 5 characters"
  }else if(!/^[0-9]+$/.test(product.sku)){
    errors.sku = "SKU must be Numerical"
  }

  // Description: required, max 200 words
  if (!product.description || !product.description.trim()) {
    errors.description = "Description is required"
  } else {
    const wordCount = product.description.trim().split(/\s+/).length
    if (wordCount > 200) {
      errors.description = "Description cannot exceed 200 words"
    }
  }

  // Quantity on hand: ≥0
  if (product.quantityOnHand !== undefined && product.quantityOnHand <= 0) {
    errors.quantityOnHand = "Quantity cannot be 0 or negative"
  }

  // Cost Price: ≥0
  if (product.costPrice !== undefined && product.costPrice <= 0) {
    errors.costPrice = "Cost price cannot be 0 or negative"
  }

  // Selling Price: ≥0
  if (product.sellingPrice !== undefined && product.sellingPrice <= 0) {
    errors.sellingPrice = "Selling price cannot be 0 or negative"
  }

  // Low stock threshold: ≥0
  if (product.lowStockThreshold && product.lowStockThreshold <= 0.0) {
    errors.lowStockThreshold = "Low stock threshold cannot be negative"
  }
  // Category: required
  if (!product.categoryName) {
    errors.categoryName = "Category is required"
  }

  // Sizes: at least one
  if (!product.selectedSizes || product.selectedSizes.length === 0) {
    errors.selectedSizes = "Select at least one size"
  }

  // File: required when creating
  if (requireFile) {
    // file is tracked separately in the form component; this check is here
    // to surface a generic message if the component passes a placeholder flag
    // when no file is selected.
    // The actual presence check is handled in the form.
  }

  return errors
}