"use client";

import { CalendarCheck, CalendarX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getViewingRequests,
  updateViewingRequestStatus,
} from "@/api/viewings.api";
import {
  OwnerEmpty,
  OwnerPageHeader,
  OwnerStatus,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ViewingRequest } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function OwnerViewingsPage() {
  const [viewings, setViewings] = useState<ViewingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken() || undefined;
  useEffect(() => {
    getViewingRequests(token)
      .then((response) => {
        if (response.success) setViewings(response.data?.items ?? []);
        else toast.error(response.message || "Unable to load viewings.");
      })
      .finally(() => setLoading(false));
  }, [token]);
  async function update(id: string, status: "CONFIRMED" | "CANCELLED") {
    const response = await updateViewingRequestStatus(id, status, token);
    if (!response.success)
      toast.error(response.message || "Unable to update viewing.");
    else {
      setViewings((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      toast.success(`Viewing ${status.toLowerCase()}.`);
    }
  }
  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="Viewing requests"
        description="Confirm or cancel tenant viewing appointments."
      />
      {loading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      ) : viewings.length === 0 ? (
        <OwnerEmpty message="No viewing requests are waiting for your response." />
      ) : (
        <div className="space-y-3">
          {viewings.map((viewing) => (
            <Card key={viewing.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                <div>
                  <p className="font-medium">
                    {new Date(viewing.scheduledAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tenant: {viewing.tenantId} · Property: {viewing.propertyId}
                  </p>
                  {viewing.notes && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {viewing.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <OwnerStatus value={viewing.status} />
                  {viewing.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => void update(viewing.id, "CONFIRMED")}
                      >
                        <CalendarCheck /> Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void update(viewing.id, "CANCELLED")}
                      >
                        <CalendarX /> Cancel
                      </Button>
                    </>
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
