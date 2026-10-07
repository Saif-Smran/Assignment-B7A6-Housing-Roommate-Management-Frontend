"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="font-heading text-xl font-bold tracking-tight">
        Failed to load dashboard data
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We could not load your dashboard metrics or activity. Please check your
        network and try again.
      </p>
      <Button
        onClick={() => reset()}
        className="mt-6 gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
      >
        <RotateCcw className="h-4 w-4" /> Reload dashboard
      </Button>
    </div>
  );
}
