import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Tenant Dashboard | UrbanMatch",
};
export default function TenantProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
