import { fetchApi } from "./client";
import type {
  ApiResponse,
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
} from "@/interfaces";
import type { Role } from "@/types";

// User Login API
export async function loginUser(
  payload: LoginPayload
): Promise<ApiResponse<AuthResponseData>> {
  return fetchApi<AuthResponseData>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// User Registration API
export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResponse<AuthResponseData>> {
  return fetchApi<AuthResponseData>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Google Authentication API
export async function googleAuth(payload: {
  token: string;
  role?: Role;
}): Promise<ApiResponse<AuthResponseData>> {
  return fetchApi<AuthResponseData>("/auth/google", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Forgot Password API
export async function requestPasswordReset(
  email: string
): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
