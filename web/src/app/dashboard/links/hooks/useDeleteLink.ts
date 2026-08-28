import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";

export default function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => linkApi.delete(id),
    onSuccess: (response) => {
      const data = response.data;
      queryClient.invalidateQueries({
        queryKey: ["link", data.id],
      });
    },
  });
}
