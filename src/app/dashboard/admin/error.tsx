"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-lg font-bold">
        Failed to load platform analytics
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        We encountered an error loading administrative users, property
        moderation data, or stats.
      </p>
      <Button
        onClick={() => reset()}
        className="mt-5 gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
      >
        <RotateCcw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
