"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/(auth)/api/auth.api";
import { clearAccessToken } from "@/lib/api/client";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useToast } from "@/lib/toast/toast-provider";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success("Signed out", "See you soon.");
    },
    onError: (error) => {
      toast.error("Logout failed", getErrorMessage(error));
    },
    onSettled: () => {
      clearAccessToken();
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}
