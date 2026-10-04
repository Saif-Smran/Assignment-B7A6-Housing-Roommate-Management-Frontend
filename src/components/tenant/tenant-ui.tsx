import { ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function TenantPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <Link
          href="/dashboard/tenant"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Overview
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Tenant workspace
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

export function TenantEmpty({ message }: { message: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center text-sm text-muted-foreground">
        <Inbox className="h-8 w-8 text-indigo-600" />
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}

export function tenantStatusVariant(status: string) {
  if (["APPROVED", "COMPLETED", "CONFIRMED", "RESOLVED"].includes(status))
    return "success" as const;
  if (["REJECTED", "CANCELLED", "FAILED"].includes(status))
    return "destructive" as const;
  return "warning" as const;
}

export const tenantSectionClass =
  "mx-auto max-w-7xl space-y-8 px-4 pb-10 sm:px-6 lg:px-8";
