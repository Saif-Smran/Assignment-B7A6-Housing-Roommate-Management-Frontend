export type Role = "TENANT" | "OWNER" | "ADMIN";

export type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type PaymentType = "RENT" | "DEPOSIT" | "UTILITY";

export type ViewingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type MaintenanceStatus =
  | "SUBMITTED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type BillStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";
export type PaymentGateway = "SSLCOMMERZ" | "STRIPE";
export type AuthProvider = "CREDENTIAL" | "GOOGLE";
