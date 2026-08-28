import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";
import { UpdateLinkPayload } from "../types";

export default function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLinkPayload }) =>
      linkApi.update(id, data),
    onSuccess: (response) => {
      const data = response.data;

      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["link", data.id] });
    },
  });
}
