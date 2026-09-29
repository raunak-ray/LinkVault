import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useToast } from "@/lib/toast/toast-provider";
import { linkApi } from "../api/link.api";
import type { CreateLinkPayload } from "../types";

export default function useCreateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateLinkPayload) => linkApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["links"],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Link saved", "Your link is in the vault.");
    },
    onError: (error) => {
      toast.error("Couldn't save link", getErrorMessage(error));
    },
  });
}
