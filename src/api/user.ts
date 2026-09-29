import { fetchApi } from "./client";
import type { ApiResponse, User } from "./interfaces";

export async function getOwnProfile(
  token?: string,
): Promise<ApiResponse<User>> {
  return fetchApi<User>("/users/me", {}, token);
}
