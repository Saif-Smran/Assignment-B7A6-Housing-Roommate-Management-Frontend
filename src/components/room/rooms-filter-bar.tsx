"use client";

import {
  Building2,
  ChevronDown,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CITIES = [
  "All Cities",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
];

const PROPERTY_TYPES = [
  "All Types",
  "Apartment",
  "Studio",
  "Shared Flat",
  "Single Room",
  "Hostel",
  "Duplex",
  "Sublet",
];

const SORT_OPTIONS = [
  { label: "Newest Listings", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: Low to High", sortBy: "rentAmount", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "rentAmount", sortOrder: "desc" },
  { label: "Alphabetical (A-Z)", sortBy: "title", sortOrder: "asc" },
];

export function RoomsFilterBar({ totalCount }: { totalCount?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(searchParams.get("q") || "");
  const [minRent, setMinRent] = React.useState(
    searchParams.get("minRent") || "",
  );
  const [maxRent, setMaxRent] = React.useState(
    searchParams.get("maxRent") || "",
  );
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  const selectedCity = searchParams.get("city") || "";
  const selectedType = searchParams.get("propertyType") || "";
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  // Sync state if searchParams change externally
  React.useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setMinRent(searchParams.get("minRent") || "");
    setMaxRent(searchParams.get("maxRent") || "");
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter change
    if (
      value &&
      value.trim() !== "" &&
      value !== "All Cities" &&
      value !== "All Types"
    ) {
      params.set(key, value.trim());
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", search);
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (minRent) params.set("minRent", minRent);
    else params.delete("minRent");

    if (maxRent) params.set("maxRent", maxRent);
    else params.delete("maxRent");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSearch("");
    setMinRent("");
    setMaxRent("");
    router.push(pathname, { scroll: false });
  };

  const activeFiltersCount = [
    selectedCity,
    selectedType,
    searchParams.get("q"),
    searchParams.get("minRent"),
    searchParams.get("maxRent"),
  ].filter(Boolean).length;

  return (
    <div className="w-full space-y-4">
      {/* Main Search & Quick Filter Bar */}
      <div className="rounded-2xl border border-border/80 bg-card p-3 md:p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Keyword Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 flex items-center"
          >
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by neighborhood, street, or keywords (e.g. Dhanmondi, Master Bed)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10 pr-24 rounded-xl border-border/60 bg-muted/30 focus-visible:bg-background text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  updateParam("q", null);
                }}
                className="absolute right-14 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <Button
              type="submit"
              size="sm"
              className="absolute right-1.5 h-8 px-3 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Search
            </Button>
          </form>

          {/* Quick Selects */}
          <div className="flex flex-wrap items-center gap-2">
            {/* City Selector */}
            <div className="relative">
              <select
                aria-label="Filter by City"
                value={selectedCity || "All Cities"}
                onChange={(e) => updateParam("city", e.target.value)}
                className="h-11 appearance-none rounded-xl border border-border/60 bg-muted/30 px-3.5 pr-8 text-xs font-medium text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city === "All Cities" ? "📍 All Locations" : `📍 ${city}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {/* Property Type Selector */}
            <div className="relative">
              <select
                aria-label="Filter by Property Type"
                value={selectedType || "All Types"}
                onChange={(e) => updateParam("propertyType", e.target.value)}
                className="h-11 appearance-none rounded-xl border border-border/60 bg-muted/30 px-3.5 pr-8 text-xs font-medium text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === "All Types"
                      ? "🏢 All Property Types"
                      : `🏢 ${type}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {/* Toggle Advanced Filters Button */}
            <Button
              type="button"
              variant={
                isAdvancedOpen || activeFiltersCount > 0 ? "default" : "outline"
              }
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`h-11 rounded-xl text-xs gap-1.5 px-3.5 font-medium ${
                isAdvancedOpen || activeFiltersCount > 0
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-indigo-600 text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {isAdvancedOpen && (
          <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Price Range Filter */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Monthly Rent Budget (BDT)</span>
                <span className="text-[11px] text-muted-foreground">
                  ৳{minRent || "0"} – ৳{maxRent || "Any"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                    ৳
                  </span>
                  <Input
                    type="number"
                    placeholder="Min Rent (e.g. 5000)"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value)}
                    className="h-9 pl-7 rounded-lg text-xs"
                  />
                </div>
                <span className="text-muted-foreground text-xs font-medium">
                  to
                </span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                    ৳
                  </span>
                  <Input
                    type="number"
                    placeholder="Max Rent (e.g. 25000)"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                    className="h-9 pl-7 rounded-lg text-xs"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePriceApply}
                  className="h-9 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Quick Property Type Tags */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="text-xs font-semibold text-foreground">
                Popular Types
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Apartment", "Studio", "Shared Flat", "Single Room"].map(
                  (type) => {
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          updateParam("propertyType", isSelected ? null : type)
                        }
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 font-medium"
                            : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Badges & Results Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          {typeof totalCount === "number" && (
            <span className="text-xs font-medium text-muted-foreground">
              Showing <strong className="text-foreground">{totalCount}</strong>{" "}
              available {totalCount === 1 ? "room/listing" : "rooms/listings"}
            </span>
          )}

          {/* Active Filter Chips */}
          {selectedCity && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 py-0.5 px-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
            >
              <MapPin className="h-3 w-3" />
              {selectedCity}
              <button
                type="button"
                onClick={() => updateParam("city", null)}
                aria-label={`Remove ${selectedCity} filter`}
                className="hover:text-destructive ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedType && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 py-0.5 px-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
            >
              <Building2 className="h-3 w-3" />
              {selectedType}
              <button
                type="button"
                onClick={() => updateParam("propertyType", null)}
                aria-label={`Remove ${selectedType} filter`}
                className="hover:text-destructive ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(searchParams.get("minRent") || searchParams.get("maxRent")) && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 py-0.5 px-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
            >
              ৳{searchParams.get("minRent") || "0"} - ৳
              {searchParams.get("maxRent") || "Any"}
              <button
                type="button"
                onClick={() => {
                  setMinRent("");
                  setMaxRent("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("minRent");
                  params.delete("maxRent");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                aria-label="Remove price range filter"
                className="hover:text-destructive ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {searchParams.get("q") && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 py-0.5 px-2 bg-muted text-muted-foreground border border-border"
            >
              &ldquo;{searchParams.get("q")}&rdquo;
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  updateParam("q", null);
                }}
                aria-label="Remove search filter"
                className="hover:text-destructive ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive font-medium underline underline-offset-4 ml-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Clear all filters
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
            Sort by:
          </span>
          <div className="relative">
            <select
              aria-label="Sort listings"
              value={`${currentSortBy}_${currentSortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("_");
                handleSortChange(sb, so);
              }}
              className="h-8 appearance-none rounded-lg border border-border/60 bg-card px-2.5 pr-7 text-xs font-medium text-foreground hover:bg-muted/40 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={`${opt.sortBy}_${opt.sortOrder}`}
                  value={`${opt.sortBy}_${opt.sortOrder}`}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
