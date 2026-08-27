import { ApiErrorResponse, ApiSuccessResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthUser } from "../types";
import { AxiosError } from "axios";
import type { RegisterPayload } from "../types";
import { authApi } from "../api/auth.api";
import { setAccessToken } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function useRegister() {
  const queryKey = ["auth", "me"];
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<
    ApiSuccessResponse<AuthUser>,
    AxiosError<ApiErrorResponse>,
    RegisterPayload
  >({
    mutationFn: authApi.register,
    mutationKey: queryKey,
    onSuccess: (response) => {
      const { accessToken, ...user } = response.data;
      setAccessToken(accessToken);

      queryClient.setQueryData(queryKey, user);
      router.push("/");
    },
  });
}
