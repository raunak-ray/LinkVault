import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

async function refreshAccessToken(): Promise<string> {
  const response = await api.post("/auth/refresh");

  const token = response.data.data.accessToken;

  setAccessToken(token);

  return token;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orignalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      orignalRequest._retry ||
      orignalRequest.url === "/auth/refresh" ||
      orignalRequest.url === "/auth/login" ||
      orignalRequest.url === "/auth/register"
    )
      return Promise.reject(error);

    orignalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const token = await refreshPromise;
      orignalRequest.headers.Authorization = `Bearer ${token}`;
      return api(orignalRequest);
    } catch (_err) {
      clearAccessToken();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  },
);

export default api;
