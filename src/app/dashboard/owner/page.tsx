"use client";

import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Building2,
  CalendarClock,
  ClipboardList,
  Hammer,
  House,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getApplicationsForProperties,
  syncPaidOwnerApplications,
} from "@/api/applications.api";
import { getMyPayments } from "@/api/payments.api";
import { getProperties } from "@/api/properties.api";
import { getMaintenanceRequests, getViewingRequests } from "@/api/viewings.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  Application,
  MaintenanceRequest,
  Payment,
  PropertyDetails,
  ViewingRequest,
} from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

type OwnerData = {
  properties: PropertyDetails[];
  applications: Application[];
  viewings: ViewingRequest[];
  maintenance: MaintenanceRequest[];
  payments: Payment[];
};

const emptyData: OwnerData = {
  properties: [],
  applications: [],
  viewings: [],
  maintenance: [],
  payments: [],
};

const statDefinitions = [
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "rooms", label: "Total rooms", icon: House },
  {
    key: "pendingApplications",
    label: "Pending applications",
    icon: ClipboardList,
  },
  { key: "completedEarnings", label: "Completed earnings", icon: Banknote },
] as const;

function formatAmount(amount: number) {
  return `BDT ${amount.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default function OwnerDashboardPage() {
  const [data, setData] = useState<OwnerData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken() || undefined;

    async function loadOwnerData() {
      const properties = await getProperties({ limit: 50 }, token);
      if (!properties.success) {
        setError(properties.message || "Unable to load owner activity.");
        setLoading(false);
        return;
      }
      const applicationsPromise = getApplicationsForProperties(
        properties.data?.items.map((property) => property.id) ?? [],
        token,
      );
      const [applications, viewings, maintenance, payments] = await Promise.all(
        [
          applicationsPromise,
          getViewingRequests(token),
          getMaintenanceRequests(token),
          getMyPayments(
            { limit: 50, sortBy: "createdAt", sortOrder: "desc" },
            token,
          ),
        ],
      );
      const responses = [applications, viewings, maintenance, payments];
      const failedResponse = responses.find((response) => !response.success);
      if (failedResponse) {
        setError(failedResponse.message || "Unable to load owner activity.");
        setLoading(false);
        return;
      }

      await syncPaidOwnerApplications(
        applications.data?.items ?? [],
        payments.data?.items ?? [],
        token,
      );

      setData({
        properties: properties.data?.items ?? [],
        applications: applications.data?.items ?? [],
        viewings: viewings.data?.items ?? [],
        maintenance: maintenance.data?.items ?? [],
        payments: payments.data?.items ?? [],
      });
      setLoading(false);
    }

    void loadOwnerData().catch(() => {
      setError("Unable to load owner activity.");
      setLoading(false);
    });
  }, []);

  const roomCount = data.properties.reduce(
    (total, property) => total + (property.rooms?.length ?? 0),
    0,
  );
  const pendingApplications = data.applications.filter(
    (application) => application.status === "PENDING",
  ).length;
  const completedEarnings = data.payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((total, payment) => total + payment.amount, 0);
  const recentActivity = [
    ...data.applications.map((item) => ({
      id: item.id,
      label: `Application ${item.status.toLowerCase()}`,
      date: item.createdAt,
      icon: ClipboardList,
    })),
    ...data.viewings.map((item) => ({
      id: item.id,
      label: `Viewing ${item.status.toLowerCase()}`,
      date: item.createdAt,
      icon: CalendarClock,
    })),
    ...data.maintenance.map((item) => ({
      id: item.id,
      label: `Maintenance ${item.status.toLowerCase()}`,
      date: item.createdAt,
      icon: Hammer,
    })),
  ]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Owner workspace
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Your property dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage listings, applications, and tenant activity from one place.
          </p>
        </div>
        <Link
          href="/dashboard/owner/properties/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-4xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add property
        </Link>
      </div>

      {error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-6 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statDefinitions.map(({ key, label, icon: Icon }) => {
          const values = {
            properties: data.properties.length.toLocaleString(),
            rooms: roomCount.toLocaleString(),
            pendingApplications: pendingApplications.toLocaleString(),
            completedEarnings: formatAmount(completedEarnings),
          };

          return (
            <Card key={key} className="border-border/60 shadow-sm">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <p
                  className={
                    loading
                      ? "h-9 w-24 animate-pulse rounded bg-muted"
                      : "text-2xl font-bold"
                  }
                >
                  {loading ? "" : values[key]}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Link
              href="/dashboard/owner/applications"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
            >
              Review applications <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-32 animate-pulse rounded-lg bg-muted" />
            ) : recentActivity.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Activity will appear here as tenants interact with your
                listings.
              </div>
            ) : (
              <div className="divide-y">
                {recentActivity.map(({ id, label, date, icon: Icon }) => (
                  <div
                    key={id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="rounded-full bg-indigo-500/10 p-2 text-indigo-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Your listings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-32 animate-pulse rounded-lg bg-muted" />
            ) : data.properties.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                <Building2 className="mx-auto mb-3 h-8 w-8 text-indigo-600" />
                Add your first property to start receiving applications.
              </div>
            ) : (
              <div className="space-y-3">
                {data.properties.slice(0, 4).map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="rounded-md bg-muted p-2">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.city} · {property.rooms?.length ?? 0} rooms
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {property.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
