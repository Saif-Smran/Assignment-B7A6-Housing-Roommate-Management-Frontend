import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications | Tenant Dashboard | UrbanMatch",
};
export default function TenantApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
