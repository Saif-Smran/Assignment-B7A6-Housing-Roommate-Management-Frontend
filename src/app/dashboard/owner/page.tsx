"use client";

import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OwnerDashboardPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" /> Owner tools
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Your property management tools will appear here as listings and
          applications are added.
        </CardContent>
      </Card>
    </section>
  );
}
