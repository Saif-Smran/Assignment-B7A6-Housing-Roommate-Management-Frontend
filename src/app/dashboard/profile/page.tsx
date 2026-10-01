"use client";

import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/interfaces";
import { getStoredUser } from "@/lib/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<Partial<User> | null>(null);

  useEffect(() => setUser(getStoredUser<Partial<User>>()), []);

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          My profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the details associated with your UrbanMatch account.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-indigo-600" /> Profile details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Full name</p>
            <p className="mt-1 font-semibold">
              {user?.fullName || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="mt-1 font-semibold">
              {user?.email || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="mt-1 font-semibold">
              {user?.phone || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="mt-1 font-semibold">{user?.role || "Not provided"}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
