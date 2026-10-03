"use client";

import { Check, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getApplicationsForProperties,
  syncPaidOwnerApplications,
  updateApplicationStatus,
} from "@/api/applications.api";
import { getMyPayments } from "@/api/payments.api";
import { getProperties } from "@/api/properties.api";
import { assignTenantToRoom, updateRoom } from "@/api/rooms.api";
import {
  OwnerEmpty,
  OwnerPageHeader,
  OwnerStatus,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Application } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function OwnerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken() || undefined;

  useEffect(() => {
    async function loadApplications() {
      const propertyResponse = await getProperties({ limit: 100 }, token);
      if (!propertyResponse.success) {
        toast.error(propertyResponse.message || "Unable to load properties.");
        setLoading(false);
        return;
      }
      const ownedProperties = propertyResponse.data?.items ?? [];
      const response = await getApplicationsForProperties(
        ownedProperties.map((property) => property.id),
        token,
      );
      if (!response.success) {
        toast.error(response.message || "Unable to load applications.");
      } else {
        const applications = response.data?.items ?? [];
        const paymentsResponse = await getMyPayments(
          { status: "COMPLETED", limit: 100 },
          token,
        );
        await syncPaidOwnerApplications(
          applications,
          paymentsResponse.success ? (paymentsResponse.data?.items ?? []) : [],
          token,
        );
        setApplications(applications);
      }
      setLoading(false);
    }
    void loadApplications();
  }, [token]);

  async function changeStatus(
    application: Application,
    status: "APPROVED" | "REJECTED",
  ) {
    const response = await updateApplicationStatus(
      application.id,
      status,
      token,
    );
    if (!response.success) {
      toast.error(response.message || "Unable to update application.");
      return;
    }
    toast.success(`Application ${status.toLowerCase()}.`);
    setApplications((current) =>
      current.map((item) =>
        item.id === application.id ? { ...item, status } : item,
      ),
    );
  }

  async function assign(application: Application) {
    const response = await assignTenantToRoom(
      application.roomId,
      { tenantId: application.tenantId, applicationId: application.id },
      token,
    );
    if (!response.success) {
      toast.error(response.message || "Unable to assign tenant.");
      return;
    }
    await updateRoom(application.roomId, { isAvailable: false }, token);
    toast.success("Tenant assigned and room marked unavailable.");
  }

  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="Applications"
        description="Review applicants and approve room assignments."
      />
      {loading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      ) : applications.length === 0 ? (
        <OwnerEmpty message="No applications have been submitted for your properties." />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">Room application</p>
                    <p className="text-sm text-muted-foreground">
                      Tenant ID: {application.tenantId} · Room ID:{" "}
                      {application.roomId}
                    </p>
                    <p className="mt-1 text-sm">
                      Move-in:{" "}
                      {new Date(application.moveInDate).toLocaleDateString()}
                    </p>
                  </div>
                  <OwnerStatus value={application.status} />
                </div>
                {application.message && (
                  <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    {application.message}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {application.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          void changeStatus(application, "APPROVED")
                        }
                      >
                        <Check /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          void changeStatus(application, "REJECTED")
                        }
                      >
                        <X /> Reject
                      </Button>
                    </>
                  )}
                  {application.status === "APPROVED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void assign(application)}
                    >
                      <UserCheck /> Assign tenant
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
