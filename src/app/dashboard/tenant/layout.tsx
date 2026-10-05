import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Dashboard | UrbanMatch",
  description:
    "Track your UrbanMatch applications, viewings, maintenance, payments, and profile.",
};

export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
