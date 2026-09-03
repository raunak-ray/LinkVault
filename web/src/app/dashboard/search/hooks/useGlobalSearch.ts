import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/search.api";

export default function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchApi.global(query, 6),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  });
}
