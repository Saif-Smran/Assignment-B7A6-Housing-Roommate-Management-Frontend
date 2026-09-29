import type {
  ApiResponse,
  Application,
  ApplicationFilterParams,
  MaintenanceRequest,
  PaginatedData,
  Payment,
  PaymentFilterParams,
  PaymentType,
  PropertyDetails,
  PropertyFilterParams,
  Room,
  User,
  ViewingRequest,
} from "./interfaces";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://b7-a6.vercel.app/api";

// Helper for making API requests
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data as ApiResponse<T>;
  } catch (error) {
    console.error(`API request error on ${endpoint}:`, error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: null as unknown as T,
    };
  }
}

// ---------------------------------------------
// 1. Properties & Rooms Endpoints
// ---------------------------------------------

export async function getProperties(
  params?: PropertyFilterParams,
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

  return fetchApi<PaginatedData<PropertyDetails>>(endpoint, {
    next: { revalidate: 30 },
  });
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

// ---------------------------------------------
// 2. User & Profile Endpoints
// ---------------------------------------------

export async function getOwnProfile(
  token?: string,
): Promise<ApiResponse<User>> {
  return fetchApi<User>("/users/me", {}, token);
}

// ---------------------------------------------
// 3. Applications Endpoints
// ---------------------------------------------

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

// ---------------------------------------------
// 4. Viewings & Maintenance Endpoints
// ---------------------------------------------

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

// ---------------------------------------------
// 5. Payments Endpoints (Stripe)
// ---------------------------------------------

export async function getMyPayments(
  params?: PaymentFilterParams,
  token?: string,
): Promise<ApiResponse<PaginatedData<Payment>>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.status) query.set("status", params.status);
  if (params?.paymentType) query.set("paymentType", params.paymentType);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  return fetchApi<PaginatedData<Payment>>(
    `/payments/my${queryString ? `?${queryString}` : ""}`,
    {},
    token,
  );
}

export async function getPaymentById(
  paymentId: string,
  token?: string,
): Promise<ApiResponse<Payment>> {
  return fetchApi<Payment>(`/payments/${paymentId}`, {}, token);
}

export async function initiatePayment(
  payload: {
    applicationId: string;
    amount: number;
    paymentType: PaymentType;
    description?: string;
    successUrl: string;
    cancelUrl: string;
  },
  token?: string,
): Promise<ApiResponse<{ checkoutUrl: string; payment: Payment }>> {
  return fetchApi<{ checkoutUrl: string; payment: Payment }>(
    "/payments/initiate",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}
