import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/lib/api/client";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";
import { authApi } from "../api/auth.api";
import type { AuthUser, LoginPayload } from "../types";

export function useLogin() {
  const queryClient = useQueryClient();
  const queryKey = ["auth", "me"];
  const router = useRouter();

  return useMutation<
    ApiSuccessResponse<AuthUser>,
    AxiosError<ApiErrorResponse>,
    LoginPayload
  >({
    mutationKey: ["auth", "login"],
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { accessToken, ...user } = response.data;
      setAccessToken(accessToken);

      queryClient.setQueryData(queryKey, user);
      router.push("/");
    },
  });
}

export default useLogin;
