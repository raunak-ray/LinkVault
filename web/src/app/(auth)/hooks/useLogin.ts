import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { setAccessToken } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function useLogin() {
  const queryClient = useQueryClient();
  const queryKey = ["auth", "login"];
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    mutationKey: queryKey,
    onSuccess: (response) => {
      const { accessToken, ...user } = response.data;
      setAccessToken(accessToken);

      queryClient.setQueryData(queryKey, user);

      router.push("/");
    },
  });
}
