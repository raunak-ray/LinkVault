import { useInfiniteQuery } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";

type UseGetAllLinksParams = {
  // page?: number;
  limit?: number;
  isFavourite?: boolean;
  search?: string;
  sort?: string;
  collectionId?: string;
};

export default function useGetAllLinks({
  limit = 20,
  isFavourite,
  search,
  sort,
  collectionId,
}: UseGetAllLinksParams = {}) {
  return useInfiniteQuery({
    queryKey: ["links", { limit, isFavourite, search, sort, collectionId }],
    queryFn: ({ pageParam }) =>
      linkApi.getAll(pageParam, limit, isFavourite, search, sort, collectionId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasNextPage) return undefined;

      return lastPage.meta.currentPage + 1;
    },
  });
}
