import { ChevronLeft, ChevronRight, FilterX, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProperties } from "@/api/api";
import type { PropertyDetails } from "@/api/interfaces";
import { PropertyCard } from "@/components/room/property-card";
import { RoomsFilterBar } from "@/components/room/rooms-filter-bar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Browse Properties & Rooms | UrbanMatch",
  description:
    "Explore verified room listings, shared apartments, student housing, and private studios across Bangladesh. Direct booking and fair utility splits.",
};

interface PropertiesPageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    propertyType?: string;
    minRent?: string;
    maxRent?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;
  }>;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 9;
  const city = resolvedParams.city;
  const propertyType = resolvedParams.propertyType;
  const minRent = resolvedParams.minRent
    ? Number(resolvedParams.minRent)
    : undefined;
  const maxRent = resolvedParams.maxRent
    ? Number(resolvedParams.maxRent)
    : undefined;
  const sortBy = resolvedParams.sortBy || "createdAt";
  const sortOrder = resolvedParams.sortOrder || "desc";
  const q = resolvedParams.q;

  // Fetch properties from backend API
  const response = await getProperties({
    page,
    limit,
    city: city && city !== "All Cities" ? city : undefined,
    propertyType:
      propertyType && propertyType !== "All Types" ? propertyType : undefined,
    minRent,
    maxRent,
    sortBy,
    sortOrder,
    q,
  });

  const properties: PropertyDetails[] = response.data?.items || [];
  const pagination = response.data?.pagination || {
    page,
    limit,
    total: properties.length,
    totalPages: Math.ceil(properties.length / limit) || 1,
  };

  const totalPages =
    pagination.totalPages ||
    pagination.pages ||
    Math.ceil(pagination.total / limit) ||
    1;

  // Helper to construct pagination query string
  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city && city !== "All Cities") params.set("city", city);
    if (propertyType && propertyType !== "All Types")
      params.set("propertyType", propertyType);
    if (minRent) params.set("minRent", minRent.toString());
    if (maxRent) params.set("maxRent", maxRent.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    params.set("page", targetPage.toString());
    return `/properties?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-3 w-3" />
              Verified Accommodations
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Find Your Ideal Room & Living Space
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
                Browse verified rooms, apartments, and shared flats with
                transparent monthly rents, verified roommates, and instant tour
                booking.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Filter Bar */}
        <Suspense
          fallback={
            <div className="h-16 rounded-2xl bg-muted/40 animate-pulse" />
          }
        >
          <RoomsFilterBar totalCount={pagination.total} />
        </Suspense>

        {/* Results Grid or Empty State */}
        {properties.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-border/60">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  className="rounded-xl text-xs gap-1"
                >
                  <Link
                    href={page > 1 ? createPageUrl(page - 1) : "#"}
                    aria-disabled={page <= 1}
                    tabIndex={page <= 1 ? -1 : undefined}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </Link>
                </Button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => {
                      const isCurrent = p === page;
                      return (
                        <Button
                          key={p}
                          asChild
                          variant={isCurrent ? "default" : "ghost"}
                          size="sm"
                          className={`h-8 w-8 rounded-lg text-xs font-semibold p-0 ${
                            isCurrent
                              ? "bg-indigo-600 text-white"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Link href={createPageUrl(p)}>{p}</Link>
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  className="rounded-xl text-xs gap-1"
                >
                  <Link
                    href={page < totalPages ? createPageUrl(page + 1) : "#"}
                    aria-disabled={page >= totalPages}
                    tabIndex={page >= totalPages ? -1 : undefined}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
              <FilterX className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-heading text-lg font-bold text-foreground">
                No matching rooms or properties found
              </h3>
              <p className="text-xs text-muted-foreground">
                We couldn&apos;t find any listings matching your active filters.
                Try adjusting your budget, selecting &quot;All Cities&quot;, or
                clearing search keywords.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
            >
              <Link href="/properties">Reset All Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
