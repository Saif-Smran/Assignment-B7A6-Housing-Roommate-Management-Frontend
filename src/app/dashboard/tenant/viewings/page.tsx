"use client";

import { CalendarClock, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getViewingRequests,
  updateViewingRequestStatus,
} from "@/api/viewings.api";
import {
  TenantEmpty,
  TenantPageHeader,
  tenantSectionClass,
  tenantStatusVariant,
} from "@/components/tenant/tenant-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ViewingRequest } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function TenantViewingsPage() {
  const [viewings, setViewings] = useState<ViewingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken() || undefined;
  useEffect(() => {
    getViewingRequests(token)
      .then((response) => {
        if (response.success) setViewings(response.data?.items ?? []);
        else
          toast.error(response.message || "Unable to load viewing requests.");
      })
      .finally(() => setLoading(false));
  }, [token]);
  const upcoming = useMemo(
    () =>
      [...viewings].sort((left, right) =>
        right.scheduledAt.localeCompare(left.scheduledAt),
      ),
    [viewings],
  );
  async function cancel(viewing: ViewingRequest) {
    const response = await updateViewingRequestStatus(
      viewing.id,
      "CANCELLED",
      token,
    );
    if (!response.success)
      toast.error(response.message || "Unable to cancel viewing.");
    else {
      setViewings((current) =>
        current.map((item) =>
          item.id === viewing.id ? { ...item, status: "CANCELLED" } : item,
        ),
      );
      toast.success("Viewing cancelled.");
    }
  }
  return (
    <section className={tenantSectionClass}>
      <TenantPageHeader
        title="Viewing requests"
        description="Review scheduled property visits and cancel pending requests."
      />
      {loading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      ) : upcoming.length === 0 ? (
        <TenantEmpty message="You have no viewing requests." />
      ) : (
        <div className="space-y-3">
          {upcoming.map((viewing) => (
            <Card key={viewing.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                <div className="flex gap-3">
                  <CalendarClock className="mt-1 h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">
                      {new Date(viewing.scheduledAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Property: {viewing.propertyId}
                    </p>
                    {viewing.notes && (
                      <p className="mt-1 text-sm">{viewing.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tenantStatusVariant(viewing.status)}>
                    {viewing.status}
                  </Badge>
                  {["PENDING", "CONFIRMED"].includes(viewing.status) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void cancel(viewing)}
                    >
                      <X /> Cancel
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
