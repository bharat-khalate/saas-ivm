import { prisma } from "../db/dbConfig.js"
import { Category } from "../../generated/prisma/index.js"

export const createCategory = async (category: string) => {
    const categoryInDb: Category = await prisma.category.create({
        data: {
            category: category
        }
    })
    return categoryInDb;
}

export const getAllCategories = async () => {
    const categoriesInDb: Category[] = await prisma.category.findMany();
    return categoriesInDb;
}


export const getCategoryById = async (categoryId: number) => {
    const categoriesInDb: Category | null = await prisma.category.findUnique({
        where: { categoryId }
    });
    return categoriesInDb;
}


export const updateCategoryById = async (categoryId: number, category: string) => {
    const updatedCategory: Category = await prisma.category.update({
        where: { categoryId },
        data: { category },
    });
    return updatedCategory;
}


export const deleteCategoryById = async (categoryId: number) => {
    const updatedCategory: Category = await prisma.category.delete({
        where: { categoryId }
    });
    return updatedCategory;
}