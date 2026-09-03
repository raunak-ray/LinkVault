import { useInfiniteQuery } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";

type UseGetAllCollectionsParams = {
    limit?: number;
    search?: string;
    sort?: string;
}

export default function useGetAllCollections({
    limit = 20,
    search,
    sort,
}: UseGetAllCollectionsParams = {}) {
    return useInfiniteQuery({
        queryKey: ["collections", { limit, search, sort }],
        queryFn: ({ pageParam }) => collectionApi.getAll(pageParam, limit, search, sort),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta.hasNextPage) return undefined;
            return lastPage.meta.currentPage + 1;
        }
    });
}

export type { UseGetAllCollectionsParams };
