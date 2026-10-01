"use client";

import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Role, User } from "@/interfaces";
import { getStoredUser } from "@/lib/auth";

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrator",
  OWNER: "Property owner",
  TENANT: "Tenant",
};

const linksByRole: Record<
  Role,
  { href: string; label: string; icon: typeof LayoutDashboard }[]
> = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    {
      href: "/dashboard/admin/properties",
      label: "Properties",
      icon: Building2,
    },
  ],
  OWNER: [
    { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/owner/properties",
      label: "My properties",
      icon: Building2,
    },
    {
      href: "/dashboard/owner/applications",
      label: "Applications",
      icon: ClipboardList,
    },
  ],
  TENANT: [
    { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/tenant/applications",
      label: "Applications",
      icon: ClipboardList,
    },
  ],
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("TENANT");
  const [user, setUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser<Partial<User>>();
    setUser(storedUser);
    if (storedUser?.role) setRole(storedUser.role);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link
          href="/"
          aria-label="UrbanMatch home"
          className="flex items-center gap-2 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">UrbanMatch</p>
            <p className="truncate text-xs text-muted-foreground">
              {roleLabels[role]} dashboard
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {linksByRole[role].map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={pathname === href}
                  tooltip={label}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard/profile" />}
                isActive={pathname === "/dashboard/profile"}
                tooltip="My profile"
              >
                <UserCircle />
                <span>My profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/properties" />}
                tooltip="Browse rooms"
              >
                <Building2 />
                <span>Browse rooms</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 text-xs">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="truncate text-muted-foreground">
            {user?.email || "Signed in"}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
