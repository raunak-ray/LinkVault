import { ApiErrorResponse, ApiSuccessResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthUser } from "../types";
import { AxiosError } from "axios";
import type { RegisterPayload } from "../types";
import { authApi } from "../api/auth.api";
import { setAccessToken } from "@/lib/api/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function useRegister() {
  const queryKey = ["auth", "me"];
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

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
      const next = searchParams.get("next");
      const target =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/dashboard";
      router.push(target);
      router.refresh();
    },
  });
}
