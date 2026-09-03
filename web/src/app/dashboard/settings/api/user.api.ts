import api from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types";
import type { User } from "@/app/(auth)/types";

export const userApi = {
  updateMe: async (data: { name?: string }) => {
    const res = await api.patch<ApiSuccessResponse<User>>("/users/me", data);
    return res.data;
  },
  deleteMe: async () => {
    const res = await api.delete<ApiSuccessResponse<null>>("/users/me");
    return res.data;
  },
};
