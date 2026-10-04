"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getOwnProfile, updateOwnProfile } from "@/api/user.api";
import {
  TenantPageHeader,
  tenantSectionClass,
} from "@/components/tenant/tenant-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { User } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function TenantProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getOwnProfile(getAuthToken() || undefined).then((response) => {
      if (response.success) setUser(response.data);
      else toast.error(response.message || "Unable to load profile.");
    });
  }, []);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    const response = await updateOwnProfile(
      {
        fullName: String(form.get("fullName")),
        phone: String(form.get("phone")),
      },
      getAuthToken() || undefined,
    );
    if (response.success) {
      setUser(response.data);
      toast.success("Profile updated.");
    } else toast.error(response.message || "Unable to update profile.");
    setSaving(false);
  }
  return (
    <section className={tenantSectionClass}>
      <TenantPageHeader
        title="Profile"
        description="Keep your tenant contact details current."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="h-32 animate-pulse rounded-lg bg-muted" />
          ) : (
            <form onSubmit={save} className="space-y-4">
              <label
                htmlFor="tenant-full-name"
                className="block space-y-1 text-sm"
              >
                <span>Full name</span>
                <Input
                  id="tenant-full-name"
                  name="fullName"
                  defaultValue={user.fullName}
                  required
                />
              </label>
              <label htmlFor="tenant-email" className="block space-y-1 text-sm">
                <span>Email</span>
                <Input id="tenant-email" value={user.email} disabled />
              </label>
              <label htmlFor="tenant-phone" className="block space-y-1 text-sm">
                <span>Phone</span>
                <Input
                  id="tenant-phone"
                  name="phone"
                  defaultValue={user.phone ?? ""}
                />
              </label>
              <Button type="submit" disabled={saving}>
                <Save /> {saving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
