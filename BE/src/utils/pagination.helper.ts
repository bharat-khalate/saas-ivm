import { Pagination } from "../config/pagination.config.js";
import { Request } from "express";

export interface PaginationValues {
    pageSize: number;
    page: number;
    skip: number;
}

export function getPaginationValues(query: Request["query"]): PaginationValues {
    const pageSize = Math.min(parseInt(query.pageSize as string) || Pagination.DEFAULT_LIMIT, Pagination.MAX_LIMIT);
    const page = Math.max(parseInt(query.page as string) || Pagination.DEFAULT_PAGE, Pagination.DEFAULT_PAGE);
    const skip = (page - 1) * pageSize;
    return { pageSize, page, skip };
}

