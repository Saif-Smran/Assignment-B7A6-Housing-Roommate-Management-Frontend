import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments | Tenant Dashboard | UrbanMatch",
};
export default function TenantPaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
