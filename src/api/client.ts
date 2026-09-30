import type { ApiResponse } from "@/interfaces";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://b7-a6.vercel.app/api";

// Helper for making API requests
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
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

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data as ApiResponse<T>;
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
