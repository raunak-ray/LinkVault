import { useQuery } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";

export default function useGetAllLinks() {
  const queryKey = ["links"];

  return useQuery({
    queryKey,
    queryFn: () => linkApi.getAll(),
  });
}
