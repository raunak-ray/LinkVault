import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";
import { UpdateLinkPayload } from "../types";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useToast } from "@/lib/toast/toast-provider";

export default function useUpdateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLinkPayload }) =>
      linkApi.update(id, data),
    onSuccess: (response) => {
      const data = response.data;

      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["link", data.id] });
      toast.success("Link updated", "Your changes were saved.");
    },
    onError: (error) => {
      toast.error("Couldn't update link", getErrorMessage(error));
    },
  });
}
