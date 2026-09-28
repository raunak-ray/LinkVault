import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useToast } from "@/lib/toast/toast-provider";

export default function useDeleteLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => linkApi.delete(id),
    onSuccess: (response) => {
      const data = response.data;
      queryClient.invalidateQueries({
        queryKey: ["link", data.id],
      });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Link deleted", "It was removed from your vault.");
    },
    onError: (error) => {
      toast.error("Couldn't delete link", getErrorMessage(error));
    },
  });
}
