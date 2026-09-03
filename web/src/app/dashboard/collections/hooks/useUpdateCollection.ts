import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { UpdateCollectionPayload } from "../types";

export default function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionPayload }) =>
      collectionApi.update(id, data),
    onSuccess: (response, variables) => {
      const id = variables.id;
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // also update the response in cache for instant reflect
      queryClient.setQueryData(["collection", id], response);
    },
  });
}
