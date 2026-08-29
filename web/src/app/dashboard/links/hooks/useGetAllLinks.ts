import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";

type UseGetAllLinksParams = {
  // page?: number;
  limit?: number;
  isFavourite?: boolean;
  search?: string;
  sort?: string;
};

export default function useGetAllLinks({
  limit = 20,
  isFavourite,
  search,
  sort,
}: UseGetAllLinksParams = {}) {
  return useInfiniteQuery({
    queryKey: ["links", { limit, isFavourite, search, sort }],
    queryFn: ({ pageParam }) =>
      linkApi.getAll(pageParam, limit, isFavourite, search, sort),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasNextPage) return undefined;

      return lastPage.meta.currentPage + 1;
    },
  });
}
