import { useQuery } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";

export default function useGetLinkById(id: string) {
  const queryKey = ["link", id];

  return useQuery({
    queryKey,
    queryFn: () => linkApi.getById(id),
    enabled: !!id,
  });
}
