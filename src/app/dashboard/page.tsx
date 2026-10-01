"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { User } from "@/interfaces";
import { getDashboardPath, getStoredUser } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser<Partial<User>>();
    router.replace(getDashboardPath(user?.role));
  }, [router]);

  return (
    <div className="p-8 text-sm text-muted-foreground">
      Opening your dashboard...
    </div>
  );
}
