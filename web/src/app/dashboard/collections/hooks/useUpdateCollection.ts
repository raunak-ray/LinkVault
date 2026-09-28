import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { UpdateCollectionPayload } from "../types";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useToast } from "@/lib/toast/toast-provider";

export default function useUpdateCollection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      toast.success("Collection updated", "Your changes were saved.");
    },
    onError: (error) => {
      toast.error("Couldn't update collection", getErrorMessage(error));
    },
  });
}
