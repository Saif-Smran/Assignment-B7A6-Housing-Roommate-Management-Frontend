import type {
  Application,
  ApplicationStatus,
  AuthProvider,
  BillStatus,
  MaintenanceRequest,
  MaintenanceStatus,
  Notification,
  Payment,
  PaymentGateway,
  PaymentStatus,
  PaymentType,
  Priority,
  Property,
  PropertyImage,
  Role,
  Room,
  User,
  UtilityBill,
  UtilitySplit,
  ViewingRequest,
  ViewingStatus,
} from "@/types";

// Re-export all model types and enums from types folder
export type {
  Role,
  ApplicationStatus,
  PaymentStatus,
  PaymentType,
  ViewingStatus,
  MaintenanceStatus,
  Priority,
  BillStatus,
  PaymentGateway,
  AuthProvider,
  User,
  Property,
  PropertyImage,
  Room,
  Application,
  Payment,
  ViewingRequest,
  MaintenanceRequest,
  UtilityBill,
  UtilitySplit,
  Notification,
};

// Generic API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: { field?: string; message: string }[];
  statusCode?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  pages?: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Populated Property Types with Images, Rooms, and Owner
export interface PropertyDetails extends Property {
  owner?: {
    id?: string;
    fullName: string;
    email?: string;
    phone?: string | null;
    role?: Role;
  };
  images?: PropertyImage[];
  rooms?: Room[];
}

// Query Parameter Interfaces
export interface PropertyFilterParams {
  page?: number;
  limit?: number;
  city?: string;
  minRent?: number;
  maxRent?: number;
  propertyType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
}

export interface ApplicationFilterParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaymentFilterParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  paymentType?: PaymentType;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
