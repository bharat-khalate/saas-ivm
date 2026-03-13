
import { getPaginationTabUi } from "../utils/pagination.util";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { DEFAULT_PAGINATION_TAB_SIZE } from "../config/pagination.config";
interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface Props {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

const Pagination = ({ meta, onPageChange }: Props) => {
    const { page, totalPages } = meta;


    // Show previous, current, next pages
    const pages = getPaginationTabUi(page, totalPages);


    return (
        <div className="grid grid-flow-col grid-rows-2 ">
            <div className="flex justify-end items-center space-x-2 ">


                <ResponsivePagination
                    current={page}
                    total={totalPages}
                    onPageChange={onPageChange}
                    previousLabel="<"
                    nextLabel=">"
                    maxWidth={DEFAULT_PAGINATION_TAB_SIZE}
                    className="pagination flex gap-1 items-center"
                    pageItemClassName="border rounded overflow-hidden"
                    pageLinkClassName="w-10 h-10 flex justify-center items-center bg-slate-900 text-gray-400 hover:bg-gray-50"
                />

            </div>
            <div className="flex justify-end  me-3 mt-1 space-x-2  text-gray-400 ">
                Showing {meta.pageSize * (meta.page - 1) + 1}-{Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} records
            </div>
        </div>
    );
};

export default Pagination;