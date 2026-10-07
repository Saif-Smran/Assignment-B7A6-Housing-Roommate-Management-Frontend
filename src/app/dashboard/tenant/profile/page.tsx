"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { type ProfileSchemaType, profileSchema } from "@/validation";

export default function TenantProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  useEffect(() => {
    getOwnProfile(getAuthToken() || undefined).then((response) => {
      if (response.success && response.data) {
        setUser(response.data);
        reset({
          fullName: response.data.fullName,
          phone: response.data.phone || "",
        });
      } else {
        toast.error(response.message || "Unable to load profile.");
      }
    });
  }, [reset]);

  const onSubmit = async (data: ProfileSchemaType) => {
    setSaving(true);
    const response = await updateOwnProfile(
      {
        fullName: data.fullName,
        phone: data.phone || "",
      },
      getAuthToken() || undefined,
    );
    if (response.success && response.data) {
      setUser(response.data);
      toast.success("Profile updated successfully.");
    } else {
      toast.error(response.message || "Unable to update profile.");
    }
    setSaving(false);
  };

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1 text-sm">
                <label htmlFor="tenant-full-name" className="font-medium">
                  Full name
                </label>
                <Input
                  id="tenant-full-name"
                  {...register("fullName")}
                  required
                />
                {errors.fullName && (
                  <p className="text-[11px] text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <label htmlFor="tenant-email" className="font-medium">
                  Email
                </label>
                <Input id="tenant-email" value={user.email} disabled />
              </div>
              <div className="space-y-1 text-sm">
                <label htmlFor="tenant-phone" className="font-medium">
                  Phone
                </label>
                <Input
                  id="tenant-phone"
                  {...register("phone")}
                  placeholder="+880 1700 000000"
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save changes
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
