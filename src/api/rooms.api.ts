import type { ApiResponse, Room } from "@/interfaces";
import { fetchApi } from "./client";

export async function createRoom(
  propertyId: string,
  payload: {
    roomNumber?: string;
    roomType: string;
    capacity: number;
    rentAmount: number;
    securityDeposit?: number;
    description?: string;
  },
  token?: string,
): Promise<ApiResponse<Room>> {
  return fetchApi<Room>(
    `/properties/${propertyId}/rooms`,
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}

export async function updateRoom(
  roomId: string,
  payload: Partial<
    Pick<
      Room,
      | "roomNumber"
      | "roomType"
      | "capacity"
      | "rentAmount"
      | "securityDeposit"
      | "description"
      | "isAvailable"
    >
  >,
  token?: string,
): Promise<ApiResponse<Room>> {
  return fetchApi<Room>(
    `/rooms/${roomId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export async function updateRoomAvailability(
  roomId: string,
  payload: Pick<Room, "availableFrom" | "availableTo" | "isAvailable">,
  token?: string,
): Promise<ApiResponse<Room>> {
  return fetchApi<Room>(
    `/rooms/${roomId}/availability`,
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export async function deleteRoom(
  roomId: string,
  token?: string,
): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/rooms/${roomId}`, { method: "DELETE" }, token);
}

export async function assignTenantToRoom(
  roomId: string,
  payload: { tenantId: string; applicationId: string },
  token?: string,
): Promise<ApiResponse<Room>> {
  return fetchApi<Room>(
    `/rooms/${roomId}/assign`,
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}
