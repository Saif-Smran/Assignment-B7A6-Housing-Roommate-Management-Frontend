import type { ApiResponse, PropertyDetails, Role } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";
import { fetchApi } from "./client";

export type AdminDashboardStats = Record<string, unknown>;

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminPage<T> {
  meta: AdminPagination;
  data: T[];
}

export async function getAdminDashboardStats(): Promise<
  ApiResponse<AdminDashboardStats>
> {
  return fetchApi<AdminDashboardStats>(
    "/admin/dashboard-stats",
    {},
    getAuthToken() || undefined,
  );
}

export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  role?: Role;
}): Promise<ApiResponse<AdminPage<AdminUser>>> {
  const query = new URLSearchParams();
  query.set("page", String(params?.page || 1));
  query.set("limit", String(params?.limit || 10));
  if (params?.role) query.set("role", params.role);

  return fetchApi<AdminPage<AdminUser>>(
    `/admin/users?${query.toString()}`,
    {},
    getAuthToken() || undefined,
  );
}

export async function updateAdminUserRole(
  userId: string,
  role: Role,
): Promise<ApiResponse<AdminUser>> {
  return fetchApi<AdminUser>(
    `/admin/users/${userId}/role`,
    { method: "PATCH", body: JSON.stringify({ role }) },
    getAuthToken() || undefined,
  );
}

export async function getAdminProperties(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<AdminPage<PropertyDetails>>> {
  const query = new URLSearchParams({
    page: String(params?.page || 1),
    limit: String(params?.limit || 10),
  });

  return fetchApi<AdminPage<PropertyDetails>>(
    `/admin/properties?${query.toString()}`,
    {},
    getAuthToken() || undefined,
  );
}

export async function deleteAdminProperty(
  propertyId: string,
): Promise<ApiResponse<null>> {
  return fetchApi<null>(
    `/admin/properties/${propertyId}`,
    { method: "DELETE" },
    getAuthToken() || undefined,
  );
}
