"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@/interfaces";
import { getDashboardPath, getStoredUser } from "@/lib/auth";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getStoredUser<Partial<User>>();
    if (user?.role === "OWNER") setAllowed(true);
    else router.replace(getDashboardPath(user?.role));
  }, [router]);

  if (!allowed) return null;
  return children;
}
