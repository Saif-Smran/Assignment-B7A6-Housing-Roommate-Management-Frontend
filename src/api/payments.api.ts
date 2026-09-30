import type {
  ApiResponse,
  PaginatedData,
  Payment,
  PaymentFilterParams,
  PaymentType,
} from "@/interfaces";
import { fetchApi } from "./client";

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
