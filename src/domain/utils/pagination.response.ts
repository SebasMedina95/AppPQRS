import { Metadata } from "../../interfaces/common/metadata.interface";

export const ExecuteMetadataPagination = ( countData: number, page: number, perPage: number ): Metadata => {

    const totalItems: number = countData;
    const pageSize: number = perPage;
    const totalPages: number = Math.ceil(totalItems / pageSize);
    const currentPage: number = page;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return {
        currentPage,
        prevPage,
        nextPage,
        totalPages,
        totalItems,
        startItem,
        endItem,
    }

}