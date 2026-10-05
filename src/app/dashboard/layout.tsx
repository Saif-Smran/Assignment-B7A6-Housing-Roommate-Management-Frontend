import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PrivateRoute } from "@/routes/private-route";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your UrbanMatch housing activity.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="min-h-svh flex-1 bg-muted/20">
          <SidebarTrigger className="m-3" />
          {children}
        </main>
      </SidebarProvider>
    </PrivateRoute>
  );
}
