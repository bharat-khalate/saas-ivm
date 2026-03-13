import { DEFAULT_PAGINATION_TAB_SIZE, paginationConfig } from "../config/pagination.config";



export const getPaginationParams = (page?: number, limit?: number) => {

    const pageNum = Math.max(page ?? paginationConfig.page, paginationConfig.page);
    const pageSize = Math.max(limit ?? paginationConfig.pageSize, paginationConfig.pageSize);

    return {
        page: pageNum,
        pageSize: pageSize
    }
}



export function getPaginationTabUi(page: number, totalPages: number): (number | string)[] {
    // Helper function to generate valid page numbers within bounds
    const generatePages = (start: number, length: number): number[] => {
        return Array.from({ length }, (_, i) => start + i).filter((p) => p > 0 && p <= totalPages);
    };

    // Case 1: When the total number of pages is less than or equal to the default tab size
    if (totalPages <= DEFAULT_PAGINATION_TAB_SIZE) {
        return generatePages(1, totalPages);
    }

    // Case 2: When the current page is close to the beginning
    if (page < DEFAULT_PAGINATION_TAB_SIZE) {
        return generatePages(1, DEFAULT_PAGINATION_TAB_SIZE);
    }

    // Case 3: When the current page is near the end
    if (page > totalPages - DEFAULT_PAGINATION_TAB_SIZE) {
        return generatePages(totalPages - DEFAULT_PAGINATION_TAB_SIZE + 1, DEFAULT_PAGINATION_TAB_SIZE);
    }

    // Case 4: When the current page is in the middle
    const pages: (string | number)[] = [
        '...',
        page - 1,
        page,
        page + 1,
        '...'
    ];

    // Make sure to fill the pagination to the default size
    const remainingSlots = DEFAULT_PAGINATION_TAB_SIZE - pages.length + 2;  // Adjust for `...` placeholders

    if (remainingSlots > 0) {
        const leftPages = generatePages(page - Math.floor(remainingSlots / 2) - 3, Math.floor(remainingSlots / 2)).map((n, i) => i % 2 == 0 && Math.floor(remainingSlots / 2) > 1 ? n : '...')
        const rightPages = generatePages(page + 3, Math.ceil(remainingSlots / 2)).map((n, i) => i % 2 == 1 ? n : '...');
        return [...leftPages, ...pages.slice(1, 4), ...rightPages];
    }

    return pages;
}