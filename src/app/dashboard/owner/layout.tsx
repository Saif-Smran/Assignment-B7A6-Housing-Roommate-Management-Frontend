import type { Metadata } from "next";
import { OwnerRouteGuard } from "@/components/dashboard/owner-route-guard";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  description:
    "Manage UrbanMatch properties, rooms, applications, maintenance, viewings, and earnings.",
};

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OwnerRouteGuard>{children}</OwnerRouteGuard>;
}
