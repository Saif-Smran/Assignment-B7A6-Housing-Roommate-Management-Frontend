"use client";

import { Building2, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { deleteProperty, getProperties } from "@/api/properties.api";
import {
  OwnerEmpty,
  OwnerPageHeader,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PropertyDetails } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState<PropertyDetails[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      const response = await getProperties(
        { limit: 100 },
        getAuthToken() || undefined,
      );
      if (response.success) setProperties(response.data?.items ?? []);
      else toast.error(response.message || "Unable to load properties.");
      setLoading(false);
    }
    void loadProperties();
  }, []);

  const filteredProperties = useMemo(
    () =>
      properties.filter((property) =>
        `${property.title} ${property.city}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [properties, query],
  );

  async function handleDelete(property: PropertyDetails) {
    if (!window.confirm(`Delete ${property.title}?`)) return;
    const response = await deleteProperty(
      property.id,
      getAuthToken() || undefined,
    );
    if (!response.success) {
      toast.error(response.message || "Unable to delete property.");
      return;
    }
    toast.success("Property deleted.");
    setProperties((current) =>
      current.filter((item) => item.id !== property.id),
    );
  }

  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="My properties"
        description="Manage the listings and rooms available to tenants."
        action={
          <Button asChild>
            <Link href="/dashboard/owner/properties/new">
              <Plus /> Add property
            </Link>
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by property or city"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-40 animate-pulse rounded-lg bg-muted" />
          ) : filteredProperties.length === 0 ? (
            <OwnerEmpty
              message={
                query
                  ? "No properties match your search."
                  : "You have not listed a property yet."
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Property</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Rooms</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProperties.map((property) => (
                    <tr key={property.id}>
                      <td className="p-3 font-medium">
                        <Link
                          href={`/dashboard/owner/properties/${property.id}`}
                          className="flex items-center gap-2 hover:text-indigo-600"
                        >
                          <Building2 className="h-4 w-4" />
                          {property.title}
                        </Link>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {property.city}, {property.country}
                      </td>
                      <td className="p-3">{property.rooms?.length ?? 0}</td>
                      <td className="p-3">
                        {property.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          aria-label={`Delete ${property.title}`}
                          onClick={() => void handleDelete(property)}
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
