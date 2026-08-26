import api from "@/lib/api/client";
import { AuthUser, LoginPayload } from "../types";
import { ApiSuccessResponse } from "@/types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiSuccessResponse<AuthUser>> => {
    const response = await api.post<ApiSuccessResponse<AuthUser>>(
      "/auth/login",
      payload,
    );

    return response.data;
  },
};
