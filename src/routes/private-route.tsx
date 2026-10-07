"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import type { Role } from "@/interfaces";
import { getDashboardPath } from "@/lib/auth";
import { useAuth } from "@/providers/auth.provider";

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
  allowedRoles?: Role[];
}

export function PrivateRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
}: PrivateRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, role } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && role) {
      if (!allowedRoles.includes(role)) {
        router.replace(getDashboardPath(role));
      }
    }
  }, [allowedRoles, isAuthenticated, isLoading, redirectTo, role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    role &&
    !allowedRoles.includes(role)
  ) {
    return null;
  }

  return <>{children}</>;
}
