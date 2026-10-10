"use client";

import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAdminPropertiesQuery,
  useAdminStatsQuery,
  useAdminUsersQuery,
} from "@/hooks/useQueries";
import type { Role } from "@/interfaces";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getRoleBadgeVariant(role: Role) {
  switch (role) {
    case "ADMIN":
      return "destructive";
    case "OWNER":
      return "default";
    default:
      return "secondary";
  }
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStatsQuery();
  const { data: usersData, isLoading: usersLoading } = useAdminUsersQuery({
    page: 1,
    limit: 5,
  });
  const { data: propertiesData, isLoading: propertiesLoading } =
    useAdminPropertiesQuery({
      page: 1,
      limit: 5,
    });

  const recentUsers = usersData?.data ?? [];
  const recentProperties = propertiesData?.data ?? [];

  // Computed metrics
  const totalRevenue = stats?.payments?.totalRevenue ?? 0;
  const totalUsers = stats?.users?.total ?? 0;
  const totalProperties = stats?.properties?.total ?? 0;
  const totalRooms = stats?.rooms?.total ?? 0;
  const occupiedRooms = stats?.rooms?.occupied ?? 0;
  const availableRooms = stats?.rooms?.available ?? 0;
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const totalApplications = stats?.applications?.total ?? 0;
  const approvedApplications = stats?.applications?.approved ?? 0;
  const pendingApplications = stats?.applications?.pending ?? 0;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 pb-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            System Administration
          </div>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Platform Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Real-time analytics, user demographics, occupancy metrics, and
            content moderation across the UrbanMatch network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/dashboard/admin/users">
              <Users className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
              Manage Users
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/dashboard/admin/properties">
              <Building2 className="mr-1.5 h-3.5 w-3.5" />
              Moderate Properties
            </Link>
          </Button>
        </div>
      </div>

      {/* Top 5 KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* 1. Revenue */}
        <Card className="border-border/60 shadow-sm relative overflow-hidden bg-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {statsLoading ? (
                <span className="inline-block h-7 w-28 animate-pulse rounded bg-muted" />
              ) : (
                `BDT ${totalRevenue.toLocaleString()}`
              )}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {stats?.payments?.completedCount ?? 0}
              </span>{" "}
              completed · {stats?.payments?.pendingCount ?? 0} pending
            </p>
          </CardContent>
        </Card>

        {/* 2. Total Users */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {statsLoading ? (
                <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                totalUsers.toLocaleString()
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {stats?.users?.tenants ?? 0} Tenants · {stats?.users?.owners ?? 0}{" "}
              Owners
            </p>
          </CardContent>
        </Card>

        {/* 3. Properties */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Properties
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {statsLoading ? (
                <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                totalProperties.toLocaleString()
              )}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="font-semibold text-blue-600">
                {stats?.properties?.active ?? 0} Active
              </span>{" "}
              · {stats?.properties?.inactive ?? 0} Inactive
            </p>
          </CardContent>
        </Card>

        {/* 4. Total Rooms */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Rooms
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <DoorOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {statsLoading ? (
                <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                totalRooms.toLocaleString()
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {availableRooms} Available · {occupiedRooms} Occupied
            </p>
          </CardContent>
        </Card>

        {/* 5. Applications */}
        <Card className="border-border/60 shadow-sm bg-card sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Applications
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-foreground">
              {statsLoading ? (
                <span className="inline-block h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                totalApplications.toLocaleString()
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {approvedApplications} Approved · {pendingApplications} Pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operational Breakdown Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Distribution Card */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              User Role Distribution
            </CardTitle>
            <Link
              href="/dashboard/admin/users"
              className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Tenants */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground font-medium">
                    Tenants
                  </span>
                  <span className="font-semibold text-foreground">
                    {stats?.users?.tenants ?? 0} (
                    {totalUsers > 0
                      ? Math.round(
                          ((stats?.users?.tenants ?? 0) / totalUsers) * 100,
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${
                        totalUsers > 0
                          ? ((stats?.users?.tenants ?? 0) / totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Owners */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground font-medium">
                    Property Owners
                  </span>
                  <span className="font-semibold text-foreground">
                    {stats?.users?.owners ?? 0} (
                    {totalUsers > 0
                      ? Math.round(
                          ((stats?.users?.owners ?? 0) / totalUsers) * 100,
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{
                      width: `${
                        totalUsers > 0
                          ? ((stats?.users?.owners ?? 0) / totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Admins */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground font-medium">
                    Administrators
                  </span>
                  <span className="font-semibold text-foreground">
                    {stats?.users?.admins ?? 0} (
                    {totalUsers > 0
                      ? Math.round(
                          ((stats?.users?.admins ?? 0) / totalUsers) * 100,
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full"
                    style={{
                      width: `${
                        totalUsers > 0
                          ? ((stats?.users?.admins ?? 0) / totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>Total platform accounts</span>
              <strong className="text-foreground">{totalUsers}</strong>
            </div>
          </CardContent>
        </Card>

        {/* Room Occupancy & Capacity */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-amber-600" />
              Room Occupancy & Utilization
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">
              {occupancyRate}% Occupied
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Utilization rate</span>
                <span className="font-bold text-foreground">
                  {occupancyRate}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                <p className="text-xs text-muted-foreground">Available Rooms</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  {availableRooms}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                <p className="text-xs text-muted-foreground">Occupied Rooms</p>
                <p className="mt-1 text-xl font-bold text-amber-600">
                  {occupiedRooms}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>Total capacity</span>
              <strong className="text-foreground">
                {totalRooms} room listings
              </strong>
            </div>
          </CardContent>
        </Card>

        {/* Transactions & Revenue Health */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Transactions & Revenue Health
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              Live Gateway
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Completed Transactions
                </span>
                <span className="font-bold text-foreground">
                  {stats?.payments?.completedCount ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Pending Transactions
                </span>
                <span className="font-bold text-foreground">
                  {stats?.payments?.pendingCount ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Total Invoices Initiated
                </span>
                <span className="font-bold text-foreground">
                  {stats?.payments?.totalCount ?? 0}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Total platform volume
              </span>
              <span className="font-bold text-emerald-600">
                BDT {totalRevenue.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users & Properties Data Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registered Users */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Platform Users
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest tenants, owners, and administrators.
              </p>
            </div>
            <Link
              href="/dashboard/admin/users"
              className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="h-40 animate-pulse rounded-lg bg-muted" />
            ) : recentUsers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                No users registered yet.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.fullName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email} · {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="text-[10px] uppercase font-bold shrink-0"
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Listed Properties */}
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Listed Properties
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recently submitted accommodation listings.
              </p>
            </div>
            <Link
              href="/dashboard/admin/properties"
              className="text-xs font-medium text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              Moderate all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <div className="h-40 animate-pulse rounded-lg bg-muted" />
            ) : recentProperties.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                No properties submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {property.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {property.city} · {property.propertyType} ·{" "}
                        {property.rooms?.length ?? 0} rooms
                      </p>
                    </div>
                    <Badge
                      variant={property.isActive ? "default" : "secondary"}
                      className={`text-[10px] shrink-0 ${
                        property.isActive
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : ""
                      }`}
                    >
                      {property.isActive ? "Active" : "Inactive"}
                    </Badge>
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
