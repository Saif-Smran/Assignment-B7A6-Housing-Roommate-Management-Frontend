"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Building2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteAdminProperty } from "@/api/admin.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPropertiesQuery } from "@/hooks/useQueries";
import type { PropertyDetails } from "@/interfaces";

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading: loading } = useAdminPropertiesQuery({ page });

  const properties = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const removeProperty = (propertyId: string) => {
    if (!window.confirm("Delete this property permanently?")) return;
    setDeletingId(propertyId);
    deleteAdminProperty(propertyId)
      .then((response) => {
        if (!response.success) {
          toast.error(response.message || "Unable to delete property.");
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
        toast.success("Property deleted.");
      })
      .catch(() => toast.error("Unable to delete property."))
      .finally(() => setDeletingId(null));
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Admin workspace
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Properties
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review every listing and remove records that should not remain on the
          platform.
        </p>
      </div>
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" /> Property directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3">Property</th>
                    <th className="px-3 py-3">Location</th>
                    <th className="px-3 py-3">Owner</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr
                      key={`property-skeleton-${index + 1}`}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="space-y-2 px-3 py-4">
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-3 w-24" />
                      </td>
                      <td className="px-3 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-3 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-3 py-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-3 py-4">
                        <Skeleton className="ml-auto h-8 w-20 rounded-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No properties are currently available.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-3">Property</th>
                      <th className="px-3 py-3">Location</th>
                      <th className="px-3 py-3">Owner</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr
                        key={property.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="font-semibold">{property.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {property.propertyType}
                          </p>
                        </td>
                        <td className="px-3 py-4">
                          {property.city}, {property.country}
                        </td>
                        <td className="px-3 py-4">
                          {property.owner?.fullName || property.ownerId}
                        </td>
                        <td className="px-3 py-4">
                          {property.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="px-3 py-4 text-right">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === property.id}
                            onClick={() => removeProperty(property.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {deletingId === property.id ? "Deleting" : "Delete"}
                          </Button>
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
