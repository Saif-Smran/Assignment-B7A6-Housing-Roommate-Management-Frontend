import type {
  ApiResponse,
  Application,
  ApplicationFilterParams,
  ApplicationStatus,
  PaginatedData,
} from "@/interfaces";
import { fetchApi } from "./client";

export async function getMyApplications(
  token?: string,
): Promise<ApiResponse<PaginatedData<Application>>> {
  return fetchApi<PaginatedData<Application>>("/applications/my", {}, token);
}

export async function getApplications(
  params?: ApplicationFilterParams,
  token?: string,
): Promise<ApiResponse<PaginatedData<Application>>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.status) query.set("status", params.status);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  return fetchApi<PaginatedData<Application>>(
    `/applications${queryString ? `?${queryString}` : ""}`,
    {},
    token,
  );
}

export async function getApplicationsForProperty(
  propertyId: string,
  token?: string,
): Promise<ApiResponse<PaginatedData<Application>>> {
  return fetchApi<PaginatedData<Application>>(
    `/applications/for-property/${propertyId}`,
    {},
    token,
  );
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  token?: string,
): Promise<ApiResponse<Application>> {
  return fetchApi<Application>(
    `/applications/${applicationId}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token,
  );
}

export async function createApplication(
  payload: {
    roomId: string;
    moveInDate: string;
    message?: string;
  },
  token?: string,
): Promise<ApiResponse<Application>> {
  return fetchApi<Application>(
    "/applications",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}
