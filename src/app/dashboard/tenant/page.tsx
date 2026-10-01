"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TenantDashboardPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Tenant workspace
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Your housing dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track applications, viewings, payments, and maintenance requests.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Find your next room</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Browse current listings and start an application.</span>
          <Button asChild>
            <Link href="/properties">
              <Search className="h-4 w-4" />
              Browse rooms
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
