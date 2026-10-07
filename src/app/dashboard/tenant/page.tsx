"use client";

import {
  AlertCircle,
  ArrowRight,
  Banknote,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTenantDashboardQuery } from "@/hooks/useQueries";
import type { Application, Payment, ViewingRequest } from "@/interfaces";
import { useAuth } from "@/providers/auth.provider";

type TenantData = {
  applications: Application[];
  viewings: ViewingRequest[];
  payments: Payment[];
};

const emptyData: TenantData = {
  applications: [],
  viewings: [],
  payments: [],
};

function statusVariant(status: string) {
  if (["APPROVED", "COMPLETED", "CONFIRMED"].includes(status))
    return "success" as const;
  if (["REJECTED", "CANCELLED", "FAILED"].includes(status))
    return "destructive" as const;
  return "warning" as const;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const {
    data: queryData,
    isLoading: loading,
    error: queryError,
  } = useTenantDashboardQuery();
  const error = queryError ? "Unable to load your dashboard." : null;
  const data: TenantData = queryData ?? emptyData;

  const upcomingViewings = useMemo(
    () =>
      data.viewings
        .filter(
          (viewing) => new Date(viewing.scheduledAt).getTime() >= Date.now(),
        )
        .sort((left, right) =>
          left.scheduledAt.localeCompare(right.scheduledAt),
        )
        .slice(0, 4),
    [data.viewings],
  );
  const latestApplications = useMemo(
    () =>
      [...data.applications]
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, 4),
    [data.applications],
  );
  const pendingPayments = data.payments.filter(
    (payment) => payment.status === "PENDING",
  );
  const completedPayments = data.payments.filter(
    (payment) => payment.status === "COMPLETED",
  );
  const completedTotal = completedPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const pendingTotal = pendingPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Tenant workspace
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Welcome{user?.fullName ? `, ${user.fullName}` : " back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track applications, viewings, payments, and maintenance requests.
          </p>
        </div>
        <Link
          href="/properties"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-4xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Search className="h-4 w-4" /> Browse rooms
        </Link>
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-6 text-sm text-destructive">
            <AlertCircle className="h-5 w-5" />
            {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Applications",
            value: data.applications.length,
            icon: ClipboardList,
          },
          {
            label: "Upcoming viewings",
            value: upcomingViewings.length,
            icon: CalendarClock,
          },
          {
            label: "Pending payments",
            value: `BDT ${pendingTotal.toLocaleString()}`,
            icon: Banknote,
          },
          {
            label: "Paid to date",
            value: `BDT ${completedTotal.toLocaleString()}`,
            icon: CheckCircle2,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
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
                    ? "h-8 w-24 animate-pulse rounded bg-muted"
                    : "text-2xl font-bold"
                }
              >
                {loading ? "" : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Latest applications</CardTitle>
            <Link
              href="/dashboard/tenant/applications"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-32 animate-pulse rounded-lg bg-muted" />
            ) : latestApplications.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                You have not applied for a room yet.
              </div>
            ) : (
              <div className="divide-y">
                {latestApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0"
                  >
                    <div>
                      <p className="text-sm font-medium">Room application</p>
                      <p className="text-xs text-muted-foreground">
                        Move-in{" "}
                        {new Date(application.moveInDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={statusVariant(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming viewings</CardTitle>
            <Link
              href="/dashboard/tenant/viewings"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-32 animate-pulse rounded-lg bg-muted" />
            ) : upcomingViewings.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No upcoming viewings scheduled.
              </div>
            ) : (
              <div className="divide-y">
                {upcomingViewings.map((viewing) => (
                  <div
                    key={viewing.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {formatDate(viewing.scheduledAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Property {viewing.propertyId}
                      </p>
                    </div>
                    <Badge variant={statusVariant(viewing.status)}>
                      {viewing.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
          ) : data.payments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Your payment history will appear here after checkout.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-175 text-left text-sm">
                <thead className="border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.payments.slice(0, 5).map((payment) => (
                    <tr key={payment.id}>
                      <td className="p-3">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">{payment.paymentType}</td>
                      <td className="p-3 font-medium">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Badge variant={statusVariant(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
