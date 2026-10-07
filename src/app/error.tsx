"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-inner">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while loading this page. Our team has been
        notified.
      </p>
      {error.message && (
        <pre className="mt-4 max-w-lg rounded-xl border border-border bg-muted/50 p-3 text-left font-mono text-xs text-muted-foreground overflow-x-auto">
          {error.message}
        </pre>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => reset()}
          className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Button asChild variant="outline" className="gap-2 rounded-xl">
          <Link href="/">
            <Home className="h-4 w-4" /> Return home
          </Link>
        </Button>
      </div>
    </div>
  );
}
