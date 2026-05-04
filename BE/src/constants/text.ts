import { settings } from "cluster";
import { maxLength, negative } from "zod";


export const TEXT = {
    app: {
        name: 'StockFlow',
    },
    commonFieldValidation:{
        invalidEmailMessage: "Please enter a valid email address",
        invalidPasswordMessage: "Password must be at least 6 characters long",
        requiredFieldMessage: "This field is required",
        shortOrgnizationNameMessage: "Organization name must be at least 6 characters ",
        longOrganizationNameMessage: "Organization name must be at most 15 characters",
        alphaOrganizationNameMessage: "Organization name must contain only alphabets",
    },
    common: {
        commonErrorMessage: 'Something went wrong. Please try again.',
    },
    product: {
        duplicateSkuMessage: "A product with this SKU already exists. Please use a unique SKU.",
        productCreatedMessage: "Product created successfully",
        productUpdatedMessage: "Product updated successfully",
        productDeletedMessage: "Product deleted successfully",
        productFetchMessage: "Product details fetched successfully",
        productCreateFailedMessage: "Failed to create product. Please try again.",
        productUpdateFailedMessage: "Failed to update product. Please try again.",
        productDeleteFailedMessage: "Failed to delete product. Please try again.",
        productFetchFailedMessage: "Failed to fetch product details. Please try again.",
        productNotFoundMessage: "Product not found",
        invalidOrganizationMessage: "Invalid organization id",
        numericalProductNameMessage: "Product name cannot contain numbers",
        skuNonNumericMessage: "SKU must contain only numbers",
        maxLengthDescriptionMessage: "Description cannot exceed 200 words",
        quantityNegativeMessage: "Quantity on hand cannot be negative",
        costPriceNegativeMessage: "Cost price cannot be negative",
        sellingPriceNegativeMessage: "Selling price cannot be negative",
        lowStockThresholdNegativeMessage: "Low stock threshold cannot be negative",
        invalidSizeMessage: "Please enter a valid size",
    },

    category: {
        categoryCreatedMessage: "Category created successfully",
        categoryFetchMessage: "Categories fetched successfully",
        categoryFetchFailedMessage: "Failed to fetch categories. Please try again.",
        categoryCreateFailedMessage: "Failed to create category. Please try again.",
    },
    dashboard: {
        fetchStatsFailedMessage: "Failed to fetch dashboard Data. Please try again.",
        fetchStatsMessage: "Dashboard Data fetched successfully",
    },
    file: {
        invalidFileNameMessage: "Invalid file name. Please try again.",
        fileUploadFailedMessage: "File upload failed. Please try again.",
        fileUploadedMessage: "File uploaded successfully",
        failFileGetMessage: "Failed to get file. Please try again.",
    },
    settings: {
        settingsUpdatedMessage: "Settings updated successfully",
        settingsUpdateFailedMessage: "Failed to update settings. Please try again.",
        settingsFetchMessage: "Settings fetched successfully",
        settingsFetchFailedMessage: "Failed to fetch settings. Please try again.",
        invalidStockThresholdMessage: "Low stock threshold must be a non-negative, non-zero number ",
        stockThresholdMissingMessage: "Low stock threshold is required",
    },
    user: {
        userNotAuthenticatedMessage: "User not authenticated",
        userNotFoundMessage: "User not found",
        userExists: "User already exists",
        userNotFound: "User not found",
        userDeleted: "User deleted successfully",
        fetchSuccess: "User fetched successfully",
        usersListSuccess: "Users fetched successfully",
        fieldsRequiredMessage: "email, password and organisationName are required", 
        invalidUserIdMessage: "Invalid user id",

    },

    auth: {
        registerSuccess: "User registered successfully",
        loginSuccess: "Login successful",
        tokenRefreshed: "Token refreshed",
        invalidCredentials: "Invalid credentials",
        authHeaderMissing: "Authorization header missing",
        invalidToken: "Invalid token",
        tokenMissingMessage: "Authorization header missing",
        authFieldsRequired: "Email and password are required",
    },
} as const

