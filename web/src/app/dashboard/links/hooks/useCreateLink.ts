import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";
import { CreateLinkPayload } from "../types";

export default function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLinkPayload) => linkApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["links"],
      });
    },
  });
}
