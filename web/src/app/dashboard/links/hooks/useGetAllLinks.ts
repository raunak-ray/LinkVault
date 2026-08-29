import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";

type UseGetAllLinksParams = {
  // page?: number;
  limit?: number;
  isFavourite?: boolean;
}

export default function useGetAllLinks({
  limit = 20, isFavourite
}: UseGetAllLinksParams = {}) {

  return useInfiniteQuery({
    queryKey: ["links", { limit, isFavourite }],
    queryFn: ({ pageParam }) => linkApi.getAll(pageParam, limit, isFavourite),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasNextPage) return undefined;

      return lastPage.meta.currentPage + 1
    }
  });
}
