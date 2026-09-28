import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/api/client";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useToast } from "@/lib/toast/toast-provider";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";
import { authApi } from "../api/auth.api";
import type { AuthUser, LoginPayload } from "../types";

export function useLogin() {
  const queryClient = useQueryClient();
  const queryKey = ["auth", "me"];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

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
      toast.success(
        `Welcome back${user.name ? `, ${user.name.split(" ")[0]}` : ""}`,
        "Signed in successfully.",
      );
      const next = searchParams.get("next");
      const target =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/dashboard";
      router.push(target);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Login failed", getErrorMessage(error));
    },
  });
}

export default useLogin;
