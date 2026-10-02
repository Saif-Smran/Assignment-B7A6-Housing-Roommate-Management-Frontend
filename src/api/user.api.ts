import type { ApiResponse, User } from "@/interfaces";
import { fetchApi } from "./client";

export async function getOwnProfile(
  token?: string,
): Promise<ApiResponse<User>> {
  return fetchApi<User>("/users/me", {}, token);
}

export async function updateOwnProfile(
  payload: Partial<Pick<User, "fullName" | "phone">>,
  token?: string,
): Promise<ApiResponse<User>> {
  return fetchApi<User>(
    "/users/me",
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}
