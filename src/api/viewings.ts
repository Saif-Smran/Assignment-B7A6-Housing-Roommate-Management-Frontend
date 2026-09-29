import { fetchApi } from "./client";
import type {
  ApiResponse,
  MaintenanceRequest,
  PaginatedData,
  ViewingRequest,
} from "./interfaces";

export async function createViewingRequest(
  payload: {
    propertyId: string;
    roomId?: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  },
  token?: string,
): Promise<ApiResponse<ViewingRequest>> {
  return fetchApi<ViewingRequest>(
    "/viewing-requests",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function getViewingRequests(
  token?: string,
): Promise<ApiResponse<PaginatedData<ViewingRequest>>> {
  return fetchApi<PaginatedData<ViewingRequest>>(
    "/viewing-requests",
    {},
    token,
  );
}

export async function getMaintenanceRequests(
  token?: string,
): Promise<ApiResponse<PaginatedData<MaintenanceRequest>>> {
  return fetchApi<PaginatedData<MaintenanceRequest>>(
    "/maintenance-requests",
    {},
    token,
  );
}
