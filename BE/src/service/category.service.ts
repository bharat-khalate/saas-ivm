import { prisma } from "../db/dbConfig.js"
import { Category } from "../../generated/prisma/index.js"

/**
 * Creates a category row.
 * @param {string} category - Category name.
 * @returns {Promise<Category>} Created category.
 */
export const createCategory = async (category: string) => {
    const categoryInDb: Category = await prisma.category.create({
        data: {
            category: category
        }
    })
    return categoryInDb;
}

/**
 * Returns all categories.
 * @returns {Promise<Category[]>} Category list.
 */
export const getAllCategories = async () => {
    const categoriesInDb: Category[] = await prisma.category.findMany();
    return categoriesInDb;
}


/**
 * Finds one category by id.
 * @param {number} categoryId - Category identifier.
 * @returns {Promise<Category | null>} Category or null.
 */
export const getCategoryById = async (categoryId: number) => {
    const categoriesInDb: Category | null = await prisma.category.findUnique({
        where: { categoryId }
    });
    return categoriesInDb;
}


/**
 * Updates category name by id.
 * @param {number} categoryId - Category identifier.
 * @param {string} category - Updated category name.
 * @returns {Promise<Category>} Updated category.
 */
export const updateCategoryById = async (categoryId: number, category: string) => {
    const updatedCategory: Category = await prisma.category.update({
        where: { categoryId },
        data: { category },
    });
    return updatedCategory;
}


/**
 * Deletes a category by id.
 * @param {number} categoryId - Category identifier.
 * @returns {Promise<Category>} Deleted category.
 */
export const deleteCategoryById = async (categoryId: number) => {
    const updatedCategory: Category = await prisma.category.delete({
        where: { categoryId }
    });
    return updatedCategory;
}