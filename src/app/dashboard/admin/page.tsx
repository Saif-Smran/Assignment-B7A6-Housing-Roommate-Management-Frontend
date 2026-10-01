"use client";

import { BarChart3, Building2, ClipboardList, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { AdminDashboardStats } from "@/api/admin.api";
import { getAdminDashboardStats } from "@/api/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statDefinitions = [
  {
    label: "Total users",
    keys: ["totalUsers", "usersCount", "users"],
    icon: Users,
  },
  {
    label: "Properties",
    keys: ["totalProperties", "propertiesCount", "properties"],
    icon: Building2,
  },
  {
    label: "Applications",
    keys: ["totalApplications", "applicationsCount", "applications"],
    icon: ClipboardList,
  },
  {
    label: "Revenue",
    keys: ["totalRevenue", "revenue", "earnings"],
    icon: BarChart3,
  },
];

function getStatValue(stats: AdminDashboardStats, keys: string[]) {
  const value = keys
    .map((key) => stats[key])
    .find((candidate) => candidate !== undefined);
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "total" in value) {
    const total = value.total;
    return typeof total === "number" ? total.toLocaleString() : String(total);
  }
  return "--";
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats()
      .then((response) => {
        if (response.success && response.data) setStats(response.data);
        else toast.error(response.message || "Unable to load dashboard stats.");
      })
      .catch(() => toast.error("Unable to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Admin workspace
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Platform overview
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor users, properties, applications, and platform activity.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statDefinitions.map(({ label, keys, icon: Icon }) => (
          <Card key={label} className="border-border/60 shadow-sm">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? "..." : getStatValue(stats, keys)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Administration quick links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Use Users to review accounts and update platform roles.</p>
          <p>Use Properties to moderate listings and remove invalid records.</p>
        </CardContent>
      </Card>
    </section>
  );
}
