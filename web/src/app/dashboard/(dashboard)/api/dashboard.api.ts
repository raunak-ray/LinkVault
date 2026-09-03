import { ApiSuccessResponse } from "@/types";
import { DashboardResponse } from "../types";
import api from "@/lib/api/client";

export const dashboardApi = {
  dashboard: async (): Promise<ApiSuccessResponse<DashboardResponse>> => {
    const response =
      await api.get<ApiSuccessResponse<DashboardResponse>>("/dashboard");
    return response.data;
  },
};
