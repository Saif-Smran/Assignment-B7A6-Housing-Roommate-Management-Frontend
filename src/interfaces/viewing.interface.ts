import type { ViewingStatus } from "@/types/enums";

export interface ViewingRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  scheduledAt: string;
  status: ViewingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
