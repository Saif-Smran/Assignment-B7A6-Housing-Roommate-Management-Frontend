import { ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function OwnerPageHeader({
  eyebrow = "Owner workspace",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <Link
          href="/dashboard/owner"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Overview
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function OwnerStatus({ value }: { value: string }) {
  const normalized = value.toUpperCase();
  const variant = ["APPROVED", "COMPLETED", "CONFIRMED", "RESOLVED"].includes(
    normalized,
  )
    ? "success"
    : ["REJECTED", "CANCELLED", "FAILED"].includes(normalized)
      ? "destructive"
      : "warning";
  return <Badge variant={variant}>{normalized.replaceAll("_", " ")}</Badge>;
}

export function OwnerEmpty({ message }: { message: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center text-sm text-muted-foreground">
        <Inbox className="h-8 w-8 text-indigo-600" />
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}

export const ownerSectionClass =
  "mx-auto max-w-7xl space-y-8 px-4 pb-10 sm:px-6 lg:px-8";
