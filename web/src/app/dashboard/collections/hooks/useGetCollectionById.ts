import { useQuery } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";

export default function useGetCollectionById(id: string) {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: () => collectionApi.getById(id),
    enabled: !!id,
  });
}
