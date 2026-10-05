import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | UrbanMatch",
  description: "Manage UrbanMatch users, properties, and platform operations.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
