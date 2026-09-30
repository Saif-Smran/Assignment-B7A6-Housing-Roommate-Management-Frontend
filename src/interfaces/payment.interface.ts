import type { PaymentGateway, PaymentStatus, PaymentType } from "@/types/enums";
import type { JsonValue } from "@/types/payment";

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface Payment {
  id: string;
  applicationId: string | null;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentGateway;
  transactionId: string | null;
  status: PaymentStatus;
  paymentType: PaymentType;
  description: string | null;
  metadata: JsonValue | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFilterParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  paymentType?: PaymentType;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
