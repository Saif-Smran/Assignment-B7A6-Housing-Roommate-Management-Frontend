import type { ApiResponse, User } from "@/interfaces";
import { fetchApi } from "./client";

export async function getOwnProfile(
  token?: string,
): Promise<ApiResponse<User>> {
  return fetchApi<User>("/users/me", {}, token);
}
