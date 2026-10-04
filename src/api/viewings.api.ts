import type {
  ApiResponse,
  MaintenanceRequest,
  MaintenanceStatus,
  PaginatedData,
  ViewingRequest,
  ViewingStatus,
} from "@/interfaces";
import { fetchApi, normalizePaginatedResponse } from "./client";

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
  return normalizePaginatedResponse(
    await fetchApi<PaginatedData<ViewingRequest> | ViewingRequest[]>(
      "/viewing-requests",
      {},
      token,
    ),
  );
}

export async function getMaintenanceRequests(
  token?: string,
): Promise<ApiResponse<PaginatedData<MaintenanceRequest>>> {
  return normalizePaginatedResponse(
    await fetchApi<PaginatedData<MaintenanceRequest> | MaintenanceRequest[]>(
      "/maintenance-requests",
      {},
      token,
    ),
  );
}

export async function createMaintenanceRequest(
  roomId: string,
  payload: {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
  },
  token?: string,
): Promise<ApiResponse<MaintenanceRequest>> {
  return fetchApi<MaintenanceRequest>(
    `/rooms/${roomId}/maintenance`,
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}

export async function updateViewingRequestStatus(
  viewingRequestId: string,
  status: ViewingStatus,
  token?: string,
): Promise<ApiResponse<ViewingRequest>> {
  return fetchApi<ViewingRequest>(
    `/viewing-requests/${viewingRequestId}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token,
  );
}

export async function updateMaintenanceRequestStatus(
  maintenanceRequestId: string,
  payload: { status: MaintenanceStatus; assignedTo?: string },
  token?: string,
): Promise<ApiResponse<MaintenanceRequest>> {
  return fetchApi<MaintenanceRequest>(
    `/maintenance-requests/${maintenanceRequestId}/status`,
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}
