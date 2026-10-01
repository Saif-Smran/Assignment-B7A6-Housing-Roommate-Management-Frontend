"use client";

import { Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  type AdminUser,
  getAdminUsers,
  updateAdminUserRole,
} from "@/api/admin.api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Role } from "@/interfaces";

const roles: Role[] = ["TENANT", "OWNER", "ADMIN"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    getAdminUsers({ page, role: roleFilter || undefined })
      .then((response) => {
        if (response.success && response.data) {
          setUsers(response.data.data);
          setTotalPages(response.data.meta.totalPages);
        } else toast.error(response.message || "Unable to load users.");
      })
      .catch(() => toast.error("Unable to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, [page, roleFilter]);

  const changeRoleFilter = (role: Role | "") => {
    setPage(1);
    setRoleFilter(role);
  };

  const changeRole = (userId: string, role: Role) => {
    setSavingId(userId);
    updateAdminUserRole(userId, role)
      .then((response) => {
        if (!response.success) {
          toast.error(response.message || "Unable to update role.");
          return;
        }
        setUsers((current) =>
          current.map((user) =>
            user.id === userId ? { ...user, role } : user,
          ),
        );
        toast.success("User role updated.");
      })
      .catch(() => toast.error("Unable to update role."))
      .finally(() => setSavingId(null));
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Admin workspace
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Users
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review accounts and manage access roles.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          Role
          <select
            value={roleFilter}
            onChange={(event) =>
              changeRoleFilter(event.target.value as Role | "")
            }
            className="h-9 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" /> Account directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3">User</th>
                    <th className="px-3 py-3">Contact</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Change role</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr
                      key={`user-skeleton-${index + 1}`}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="space-y-2 px-3 py-4">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-48" />
                      </td>
                      <td className="space-y-2 px-3 py-4">
                        <Skeleton className="h-4 w-44" />
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="px-3 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="px-3 py-4">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No users matched this filter.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-3">User</th>
                      <th className="px-3 py-3">Contact</th>
                      <th className="px-3 py-3">Role</th>
                      <th className="px-3 py-3">Change role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="font-semibold">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.id}
                          </p>
                        </td>
                        <td className="px-3 py-4">
                          <p>{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.phone || "No phone"}
                          </p>
                        </td>
                        <td className="px-3 py-4">
                          <Badge variant="secondary">{user.role}</Badge>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={user.role}
                              disabled={savingId === user.id}
                              onChange={(event) =>
                                changeRole(user.id, event.target.value as Role)
                              }
                              className="h-8 rounded-lg border border-border bg-background px-2 text-xs"
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                            {savingId === user.id && (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
