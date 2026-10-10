import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FilterX,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProperties } from "@/api/properties.api";
import { PropertyCard } from "@/components/room/property-card";
import { RoomsFilterBar } from "@/components/room/rooms-filter-bar";
import { Button } from "@/components/ui/button";
import type { PropertyDetails } from "@/interfaces";

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

function getPaginationRange(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const resolvedParams = await searchParams;

  const page = Math.max(1, Number(resolvedParams.page) || 1);
  const limit = 6; // Display exactly 6 properties per page
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

  // Fetch properties from backend API with 6 items per page limit
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

  const totalItems = pagination.total ?? properties.length;
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);
  const paginationRange = getPaginationRange(page, totalPages);

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
              <nav
                aria-label="Pagination Navigation"
                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/60"
              >
                {/* Result count summary */}
                <p className="text-xs text-muted-foreground order-2 sm:order-1">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {startItem}–{endItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalItems}
                  </span>{" "}
                  properties (Page {page} of {totalPages})
                </p>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  {/* First page button */}
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    className="h-8 w-8 rounded-lg border-border/60"
                    title="First page"
                  >
                    <Link
                      href={page > 1 ? createPageUrl(1) : "#"}
                      aria-disabled={page <= 1}
                      tabIndex={page <= 1 ? -1 : undefined}
                      className={
                        page <= 1 ? "pointer-events-none opacity-40" : ""
                      }
                    >
                      <ChevronsLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">First page</span>
                    </Link>
                  </Button>

                  {/* Previous button */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    className="h-8 px-2.5 rounded-lg text-xs gap-1 border-border/60"
                  >
                    <Link
                      href={page > 1 ? createPageUrl(page - 1) : "#"}
                      aria-disabled={page <= 1}
                      tabIndex={page <= 1 ? -1 : undefined}
                      className={
                        page <= 1 ? "pointer-events-none opacity-40" : ""
                      }
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Previous</span>
                    </Link>
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1 px-1">
                    {paginationRange.map((item) => {
                      if (typeof item === "string") {
                        return (
                          <span
                            key={item}
                            className="flex h-8 w-6 items-center justify-center text-muted-foreground"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </span>
                        );
                      }

                      const isCurrent = item === page;
                      return (
                        <Button
                          key={item}
                          asChild
                          variant={isCurrent ? "default" : "outline"}
                          size="sm"
                          className={`h-8 w-8 rounded-lg text-xs font-semibold p-0 transition-colors ${
                            isCurrent
                              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20"
                              : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                          aria-current={isCurrent ? "page" : undefined}
                        >
                          <Link href={createPageUrl(item)}>{item}</Link>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Next button */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    className="h-8 px-2.5 rounded-lg text-xs gap-1 border-border/60"
                  >
                    <Link
                      href={page < totalPages ? createPageUrl(page + 1) : "#"}
                      aria-disabled={page >= totalPages}
                      tabIndex={page >= totalPages ? -1 : undefined}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-40"
                          : ""
                      }
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>

                  {/* Last page button */}
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    className="h-8 w-8 rounded-lg border-border/60"
                    title="Last page"
                  >
                    <Link
                      href={page < totalPages ? createPageUrl(totalPages) : "#"}
                      aria-disabled={page >= totalPages}
                      tabIndex={page >= totalPages ? -1 : undefined}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-40"
                          : ""
                      }
                    >
                      <ChevronsRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Last page</span>
                    </Link>
                  </Button>
                </div>
              </nav>
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
                {page > 1
                  ? "No more properties on this page"
                  : "No matching rooms or properties found"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {page > 1
                  ? `You are on page ${page}, but no listings were returned. Try returning to page 1.`
                  : 'We couldn\'t find any listings matching your active filters. Try adjusting your budget, selecting "All Cities", or clearing search keywords.'}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
            >
              <Link href={page > 1 ? createPageUrl(1) : "/properties"}>
                {page > 1 ? "Go to Page 1" : "Reset All Filters"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
