import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useToast } from "@/lib/toast/toast-provider";
import { collectionApi } from "../api/collection.api";

export default function useDeleteCollection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => collectionApi.delete(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection", id] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      queryClient.removeQueries({ queryKey: ["collection", id] });

      // The API wraps payloads in `data`; a null result means "older server".
      const removed = data?.data?.deletedLinks ?? 0;
      toast.success(
        "Collection deleted",
        removed > 0
          ? `It and ${removed} ${removed === 1 ? "link" : "links"} were removed.`
          : "It was removed from your vault.",
      );
    },
    onError: (error) => {
      toast.error("Couldn't delete collection", getErrorMessage(error));
    },
  });
}
