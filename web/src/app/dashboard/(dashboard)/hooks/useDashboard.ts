import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export default function useDashboard() {
  const queryKey = ["dashboard"];

  return useQuery({
    queryKey,
    queryFn: dashboardApi.dashboard,
    retry: 3,
  });
}
