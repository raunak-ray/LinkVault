import api from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types";
import type { DashboardResponse } from "../types";

export const dashboardApi = {
  dashboard: async (): Promise<ApiSuccessResponse<DashboardResponse>> => {
    const response =
      await api.get<ApiSuccessResponse<DashboardResponse>>("/dashboard");
    return response.data;
  },
};
