"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertiesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h2 className="font-heading text-xl font-bold tracking-tight">
        Failed to load properties
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We encountered a problem retrieving property listings from the server.
      </p>
      <Button
        onClick={() => reset()}
        className="mt-6 gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
      >
        <RotateCcw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
