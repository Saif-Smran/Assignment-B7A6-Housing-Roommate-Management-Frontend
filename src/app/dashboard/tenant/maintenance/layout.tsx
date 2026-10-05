import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance | Tenant Dashboard | UrbanMatch",
};
export default function TenantMaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
