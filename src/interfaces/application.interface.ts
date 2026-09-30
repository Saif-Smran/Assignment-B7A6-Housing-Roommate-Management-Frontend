import type { ApplicationStatus } from "./enums.interface";

export interface Application {
  id: string;
  tenantId: string;
  roomId: string;
  status: ApplicationStatus;
  moveInDate: string;
  moveOutDate: string | null;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ApplicationFilterParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
