import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viewings | Tenant Dashboard | UrbanMatch",
};
export default function TenantViewingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
