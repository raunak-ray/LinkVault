import axios from "axios";
import type { ApiErrorResponse } from "@/types";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    const msg = data?.message;
    if (Array.isArray(msg) && msg.length) return msg[0];
    if (typeof msg === "string" && msg.trim()) return msg;
    if (!error.response)
      return "Unable to reach server. Check your connection.";
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
