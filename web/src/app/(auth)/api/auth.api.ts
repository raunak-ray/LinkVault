import api, { rawApi } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types";
import type {
  AuthUser,
  LoginPayload,
  RefreshResponse,
  RegisterPayload,
  User,
} from "../types";

export const authApi = {
  login: async (
    payload: LoginPayload,
  ): Promise<ApiSuccessResponse<AuthUser>> => {
    const response = await api.post<ApiSuccessResponse<AuthUser>>(
      "/auth/login",
      payload,
    );
    return response.data;
  },

  register: async (
    payload: RegisterPayload,
  ): Promise<ApiSuccessResponse<AuthUser>> => {
    const response = await api.post<ApiSuccessResponse<AuthUser>>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  refresh: async (): Promise<ApiSuccessResponse<RefreshResponse>> => {
    // Use rawApi so we don't attach stale Authorization and don't recurse via interceptor
    const response =
      await rawApi.post<ApiSuccessResponse<RefreshResponse>>("/auth/refresh");
    return response.data;
  },

  logout: async (): Promise<ApiSuccessResponse<{ success: boolean }>> => {
    const response =
      await rawApi.post<ApiSuccessResponse<{ success: boolean }>>("/auth/logout");
    return response.data;
  },

  getMe: async (): Promise<ApiSuccessResponse<User>> => {
    const response = await api.get<ApiSuccessResponse<User>>("/auth/me");
    return response.data;
  },
};
