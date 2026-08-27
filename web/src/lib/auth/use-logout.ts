"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/(auth)/api/auth.api";
import { clearAccessToken } from "@/lib/api/client";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAccessToken();
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}
