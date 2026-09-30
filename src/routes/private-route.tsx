"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PrivateRoute({
  children,
  redirectTo = "/login",
}: PrivateRouteProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAllowed(true);
      return;
    }

    router.replace(redirectTo);
  }, [redirectTo, router]);

  if (!allowed) return null;

  return children;
}
