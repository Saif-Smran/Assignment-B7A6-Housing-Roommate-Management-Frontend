import type { ApiResponse } from "@/interfaces";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://b7-a6.vercel.app/api";

const API_CACHE_SECONDS = 60;

const browserGetCache = new Map<
  string,
  { expiresAt: number; data: ApiResponse<unknown> }
>();

type ApiRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

// Helper for making API requests
export async function fetchApi<T>(
  endpoint: string,
  options: ApiRequestInit = {},
  token?: string,
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const method = (options.method || "GET").toUpperCase();
  const canUseBrowserCache =
    typeof window !== "undefined" &&
    method === "GET" &&
    options.cache !== "no-store";
  const cacheKey = `${url}|${token || "anonymous"}`;

  if (canUseBrowserCache) {
    const cached = browserGetCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as ApiResponse<T>;
    }
    if (cached) browserGetCache.delete(cacheKey);
  }

  const requestOptions: ApiRequestInit =
    method === "GET" && options.cache !== "no-store"
      ? {
          ...options,
          next: {
            ...options.next,
            revalidate: API_CACHE_SECONDS,
          },
        }
      : options;

  try {
    const res = await fetch(url, {
      ...requestOptions,
      headers,
    });

    const data = await res.json();
    const apiResponse = data as ApiResponse<T>;
    if (canUseBrowserCache) {
      browserGetCache.set(cacheKey, {
        expiresAt: Date.now() + API_CACHE_SECONDS * 1000,
        data: apiResponse,
      });
    } else if (method !== "GET") {
      browserGetCache.clear();
    }
    return apiResponse;
  } catch (error) {
    console.error(`API request error on ${endpoint}:`, error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: null as unknown as T,
    };
  }
}
