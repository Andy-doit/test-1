import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { handleExpiredToken } from "@/lib/utils/authHandler";
import { normalizeUrl, buildApiBaseUrl } from "@/lib/utils/url";
import { getClientCookie, setAuthCookies } from "@/lib/utils/cookies";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

let cachedBaseURL: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000;

function getBackendBaseURL(forceRefresh = false): string {
  const now = Date.now();
  if (!forceRefresh && cachedBaseURL !== null && now - cacheTimestamp < CACHE_TTL) {
    return cachedBaseURL;
  }

  let primaryApiHost = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
  let fallbackApiHost = normalizeUrl(process.env.NEXT_PUBLIC_DEV_API_URL);

  const isServer = typeof window === "undefined";

  if (isServer) {
    if (primaryApiHost.startsWith("/")) {
      primaryApiHost = `http://127.0.0.1:3000${primaryApiHost}`;
    }
    if (fallbackApiHost.startsWith("/")) {
      fallbackApiHost = `http://127.0.0.1:3000${fallbackApiHost}`;
    }
  }

  const apiBaseUrl = primaryApiHost || fallbackApiHost;
  const baseURL = buildApiBaseUrl(apiBaseUrl);

  cachedBaseURL = baseURL;
  cacheTimestamp = now;

  return baseURL;
}

async function getToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return getClientCookie("auth_token");
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token");
      return token ? token.value : null;
    } catch {
      return null;
    }
  }
}

async function getRefreshToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return getClientCookie("refresh_token");
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("refresh_token");
      return token ? token.value : null;
    } catch {
      return null;
    }
  }
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

function createRequestInterceptor() {
  return async (config: InternalAxiosRequestConfig) => {
    if (typeof window === "undefined") {
      config.baseURL = getBackendBaseURL(true);
    }

    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  };
}

function createResponseInterceptor(client: AxiosInstance) {
  return async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || "";
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        const baseURL = getBackendBaseURL();
        const { data } = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken: refreshToken,
          refresh_token: refreshToken, // keep snake_case just in case
        });

        const newAccessToken = data?.accessToken || data?.access_token;
        const newRefreshToken = data?.refreshToken || data?.refresh_token;

        if (newAccessToken) {
          setAuthCookies(newAccessToken, newRefreshToken);

          client.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;

          processQueue(null, newAccessToken);
          return client(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          await handleExpiredToken();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  };
}

// Authenticated client — used for all API calls that require authentication
export const backendClient: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: DEFAULT_HEADERS,
  timeout: 30000,
});

backendClient.interceptors.request.use(
  createRequestInterceptor(),
  (error) => Promise.reject(error),
);

backendClient.interceptors.response.use(
  (response) => response,
  createResponseInterceptor(backendClient),
);

// Public client — used for public endpoints (no auth token attachment needed)
// NOTE: Only use this for truly public endpoints. Most endpoints require auth.
export const appClient: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: DEFAULT_HEADERS,
  timeout: 30000,
});

// FIX: Attach JWT token to appClient so it's not always unauthenticated
appClient.interceptors.request.use(
  createRequestInterceptor(),
  (error) => Promise.reject(error),
);

appClient.interceptors.response.use(
  (response) => response,
  createResponseInterceptor(appClient),
);

export function invalidateBaseURLCache(): void {
  cachedBaseURL = null;
  cacheTimestamp = 0;
}
