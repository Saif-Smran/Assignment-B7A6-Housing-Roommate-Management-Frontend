import type {
  ApiResponse,
  PaginatedData,
  PropertyDetails,
  PropertyFilterParams,
  Room,
} from "@/interfaces";
import { fetchApi } from "./client";

export async function getProperties(
  params?: PropertyFilterParams,
  token?: string,
): Promise<ApiResponse<PaginatedData<PropertyDetails>>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.city) query.set("city", params.city);
  if (params?.minRent) query.set("minRent", params.minRent.toString());
  if (params?.maxRent) query.set("maxRent", params.maxRent.toString());
  if (params?.propertyType) query.set("propertyType", params.propertyType);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params?.q) query.set("q", params.q);

  const queryString = query.toString();
  const endpoint = `/properties${queryString ? `?${queryString}` : ""}`;

  return fetchApi<PaginatedData<PropertyDetails>>(
    endpoint,
    { next: { revalidate: 30 } },
    token,
  );
}

export async function createProperty(
  payload: Pick<
    PropertyDetails,
    | "title"
    | "description"
    | "address"
    | "city"
    | "state"
    | "country"
    | "zipCode"
    | "propertyType"
    | "amenities"
  >,
  token?: string,
): Promise<ApiResponse<PropertyDetails>> {
  return fetchApi<PropertyDetails>(
    "/properties",
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}

export async function updateProperty(
  propertyId: string,
  payload: Partial<
    Pick<
      PropertyDetails,
      | "title"
      | "description"
      | "address"
      | "city"
      | "state"
      | "country"
      | "zipCode"
      | "propertyType"
      | "amenities"
      | "isActive"
    >
  >,
  token?: string,
): Promise<ApiResponse<PropertyDetails>> {
  return fetchApi<PropertyDetails>(
    `/properties/${propertyId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export async function deleteProperty(
  propertyId: string,
  token?: string,
): Promise<ApiResponse<null>> {
  return fetchApi<null>(
    `/properties/${propertyId}`,
    { method: "DELETE" },
    token,
  );
}

export async function searchProperties(
  keyword: string,
): Promise<ApiResponse<PaginatedData<PropertyDetails>>> {
  return fetchApi<PaginatedData<PropertyDetails>>(
    `/properties/search?q=${encodeURIComponent(keyword)}`,
    { next: { revalidate: 30 } },
  );
}

export async function getPropertyById(
  id: string,
): Promise<ApiResponse<PropertyDetails>> {
  return fetchApi<PropertyDetails>(`/properties/${id}`, {
    next: { revalidate: 30 },
  });
}

export async function getRoomsByPropertyId(
  propertyId: string,
): Promise<ApiResponse<Room[]>> {
  return fetchApi<Room[]>(`/properties/${propertyId}/rooms`, {
    next: { revalidate: 30 },
  });
}

export async function getRoomById(roomId: string): Promise<ApiResponse<Room>> {
  return fetchApi<Room>(`/rooms/${roomId}`, {
    next: { revalidate: 30 },
  });
}
