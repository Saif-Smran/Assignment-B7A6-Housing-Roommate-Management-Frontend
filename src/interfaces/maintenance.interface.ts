import type { MaintenanceStatus, Priority } from "@/types";

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  tenantId: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: Priority;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
