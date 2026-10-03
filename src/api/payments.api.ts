import type {
  ApiResponse,
  PaginatedData,
  Payment,
  PaymentFilterParams,
  PaymentType,
} from "@/interfaces";
import { fetchApi, normalizePaginatedResponse } from "./client";

export interface OwnerEarningsData {
  payments: Payment[];
  totalEarnings: number;
  byType: Record<string, number>;
}

type OwnerEarningsResponse =
  | Payment[]
  | {
      payments?: Payment[];
      items?: Payment[];
      total?: number;
      totalRevenue?: number;
      totalEarnings?: number;
      byType?: Record<string, number>;
    };

export async function getOwnerEarnings(
  token?: string,
): Promise<ApiResponse<OwnerEarningsData>> {
  const response = await fetchApi<OwnerEarningsResponse>(
    "/payments/earnings",
    {},
    token,
  );
  const raw = response.data;
  const payments = Array.isArray(raw)
    ? raw
    : (raw?.payments ?? raw?.items ?? []);
  const completedPayments = payments.filter(
    (payment) => payment.status === "COMPLETED",
  );
  const byType = completedPayments.reduce<Record<string, number>>(
    (summary, payment) => {
      summary[payment.paymentType] =
        (summary[payment.paymentType] ?? 0) + payment.amount;
      return summary;
    },
    {},
  );
  const reportedTotal = Array.isArray(raw)
    ? undefined
    : (raw?.totalEarnings ?? raw?.totalRevenue ?? raw?.total);

  return {
    ...response,
    data: {
      payments,
      totalEarnings:
        reportedTotal ??
        completedPayments.reduce((total, payment) => total + payment.amount, 0),
      byType,
    },
  };
}

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
  return normalizePaginatedResponse(
    await fetchApi<PaginatedData<Payment> | Payment[]>(
      `/payments/my${queryString ? `?${queryString}` : ""}`,
      {},
      token,
    ),
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
