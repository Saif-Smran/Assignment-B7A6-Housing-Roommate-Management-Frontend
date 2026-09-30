import type {
  ApiResponse,
  AuthResponseData,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
} from "@/interfaces";
import { fetchApi } from "./client";

export async function demoLogin(role: import("@/interfaces").Role) {
  const response = await fetch("/api/demo-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  return (await response.json()) as ApiResponse<AuthResponseData>;
}

// User Login API
export async function loginUser(
  payload: LoginPayload,
): Promise<ApiResponse<AuthResponseData>> {
  return fetchApi<AuthResponseData>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// User Registration API
export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiResponse<AuthResponseData>> {
  return fetchApi<AuthResponseData>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Google Authentication API
export async function googleAuth(
  payload: GoogleAuthPayload,
): Promise<ApiResponse<AuthResponseData>> {
  return fetchApi<AuthResponseData>("/auth/google", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Forgot Password API
export async function requestPasswordReset(
  email: string,
): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
