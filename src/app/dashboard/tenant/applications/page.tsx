"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Ban, ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updateApplicationStatus } from "@/api/applications.api";
import {
  TenantEmpty,
  TenantPageHeader,
  tenantSectionClass,
  tenantStatusVariant,
} from "@/components/tenant/tenant-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTenantApplicationsQuery } from "@/hooks/useQueries";
import type { Application, ApplicationStatus } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

const filters: Array<"ALL" | ApplicationStatus> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

export default function TenantApplicationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading: loading } = useTenantApplicationsQuery();
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const token = getAuthToken() || undefined;

  const applications = data ?? [];

  const visibleApplications = useMemo(
    () =>
      applications.filter(
        (application) => filter === "ALL" || application.status === filter,
      ),
    [applications, filter],
  );

  async function cancel(application: Application) {
    const response = await updateApplicationStatus(
      application.id,
      "CANCELLED",
      token,
    );
    if (!response.success) {
      toast.error(response.message || "Unable to cancel application.");
    } else {
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
      toast.success("Application cancelled.");
    }
  }
  return (
    <section className={tenantSectionClass}>
      <TenantPageHeader
        title="My applications"
        description="Track room applications and cancel pending requests."
      />
      <div className="flex flex-wrap gap-2">
        {filters.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? "default" : "outline"}
            onClick={() => setFilter(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      ) : visibleApplications.length === 0 ? (
        <TenantEmpty message="No applications match this status filter." />
      ) : (
        <div className="space-y-4">
          {visibleApplications.map((application) => (
            <Card key={application.id}>
              <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
                <div className="flex gap-3">
                  <ClipboardList className="mt-1 h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">Room application</p>
                    <p className="text-sm text-muted-foreground">
                      Room: {application.roomId}
                    </p>
                    <p className="mt-1 text-sm">
                      Move-in:{" "}
                      {new Date(application.moveInDate).toLocaleDateString()}
                    </p>
                    {application.message && (
                      <p className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                        {application.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tenantStatusVariant(application.status)}>
                    {application.status}
                  </Badge>
                  {application.status === "PENDING" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void cancel(application)}
                    >
                      <Ban /> Cancel
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
