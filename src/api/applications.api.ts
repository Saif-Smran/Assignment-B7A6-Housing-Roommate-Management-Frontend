import type {
  ApiResponse,
  Application,
  ApplicationFilterParams,
  ApplicationStatus,
  PaginatedData,
  Payment,
} from "@/interfaces";
import { fetchApi, normalizePaginatedResponse } from "./client";
import { assignTenantToRoom, updateRoom } from "./rooms.api";

export async function getMyApplications(
  token?: string,
): Promise<ApiResponse<PaginatedData<Application>>> {
  return normalizePaginatedResponse(
    await fetchApi<PaginatedData<Application> | Application[]>(
      "/applications/my",
      {},
      token,
    ),
  );
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
  return normalizePaginatedResponse(
    await fetchApi<PaginatedData<Application> | Application[]>(
      `/applications${queryString ? `?${queryString}` : ""}`,
      {},
      token,
    ),
  );
}

export async function getApplicationsForProperty(
  propertyId: string,
  token?: string,
): Promise<ApiResponse<PaginatedData<Application>>> {
  return normalizePaginatedResponse(
    await fetchApi<PaginatedData<Application> | Application[]>(
      `/applications/for-property/${propertyId}`,
      {},
      token,
    ),
  );
}

export async function getApplicationsForProperties(
  propertyIds: string[],
  token?: string,
): Promise<ApiResponse<PaginatedData<Application>>> {
  const responses = await Promise.all(
    propertyIds.map((propertyId) =>
      getApplicationsForProperty(propertyId, token),
    ),
  );
  const failedResponse = responses.find((response) => !response.success);
  if (failedResponse) return failedResponse;

  const items = responses.flatMap((response) => response.data?.items ?? []);
  return {
    success: true,
    message: "Applications loaded.",
    data: {
      items,
      pagination: {
        page: 1,
        limit: items.length,
        total: items.length,
        pages: 1,
      },
    },
  };
}

export async function syncPaidOwnerApplications(
  applications: Application[],
  payments: Payment[],
  token?: string,
): Promise<void> {
  const completedApplicationIds = new Set(
    payments
      .filter((payment) => payment.status === "COMPLETED")
      .map((payment) => payment.applicationId)
      .filter((applicationId): applicationId is string =>
        Boolean(applicationId),
      ),
  );
  const paidApprovedApplications = applications.filter(
    (application) =>
      application.status === "APPROVED" &&
      completedApplicationIds.has(application.id),
  );

  await Promise.all(
    paidApprovedApplications.map(async (application) => {
      const assignment = await assignTenantToRoom(
        application.roomId,
        { tenantId: application.tenantId, applicationId: application.id },
        token,
      );
      if (assignment.success) {
        await updateRoom(application.roomId, { isAvailable: false }, token);
      }
    }),
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
