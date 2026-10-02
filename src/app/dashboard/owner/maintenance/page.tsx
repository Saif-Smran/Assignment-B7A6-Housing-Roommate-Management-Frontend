"use client";

import { Hammer, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getMaintenanceRequests,
  updateMaintenanceRequestStatus,
} from "@/api/viewings.api";
import {
  OwnerEmpty,
  OwnerPageHeader,
  OwnerStatus,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MaintenanceRequest, MaintenanceStatus } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

const statuses: MaintenanceStatus[] = [
  "SUBMITTED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
];
export default function OwnerMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken() || undefined;
  useEffect(() => {
    getMaintenanceRequests(token)
      .then((response) => {
        if (response.success) setRequests(response.data?.items ?? []);
        else
          toast.error(
            response.message || "Unable to load maintenance requests.",
          );
      })
      .finally(() => setLoading(false));
  }, [token]);
  async function update(
    request: MaintenanceRequest,
    status: MaintenanceStatus,
    assignedTo: string,
  ) {
    const response = await updateMaintenanceRequestStatus(
      request.id,
      { status, assignedTo: assignedTo || undefined },
      token,
    );
    if (!response.success)
      toast.error(response.message || "Unable to update request.");
    else {
      setRequests((current) =>
        current.map((item) =>
          item.id === request.id
            ? { ...item, status, assignedTo: assignedTo || null }
            : item,
        ),
      );
      toast.success("Maintenance request updated.");
    }
  }
  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="Maintenance"
        description="Track repair requests and update their progress."
      />
      {loading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      ) : requests.length === 0 ? (
        <OwnerEmpty message="No maintenance requests have been raised for your rooms." />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="flex gap-3">
                    <Hammer className="mt-1 h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Room: {request.roomId} · Tenant: {request.tenantId} ·
                        Priority: {request.priority}
                      </p>
                      <p className="mt-1 text-sm">{request.description}</p>
                    </div>
                  </div>
                  <OwnerStatus value={request.status} />
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                  <Input
                    id={`assignee-${request.id}`}
                    defaultValue={request.assignedTo ?? ""}
                    placeholder="Assigned technician"
                  />
                  <select
                    id={`status-${request.id}`}
                    defaultValue={request.status}
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const assignedTo = (
                        document.getElementById(
                          `assignee-${request.id}`,
                        ) as HTMLInputElement
                      ).value;
                      const status = (
                        document.getElementById(
                          `status-${request.id}`,
                        ) as HTMLSelectElement
                      ).value as MaintenanceStatus;
                      void update(request, status, assignedTo);
                    }}
                  >
                    <Save /> Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
