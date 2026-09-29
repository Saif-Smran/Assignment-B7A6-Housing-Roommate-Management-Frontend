"use client";

import {
  Banknote,
  Building,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const [rentBudget, setRentBudget] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCity) params.set("city", selectedCity);
    if (selectedType) params.set("propertyType", selectedType);
    if (rentBudget) {
      if (rentBudget === "under10k") {
        params.set("maxRent", "10000");
      } else if (rentBudget === "10k-20k") {
        params.set("minRent", "10000");
        params.set("maxRent", "20000");
      } else if (rentBudget === "above20k") {
        params.set("minRent", "20000");
      }
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-indigo-50/50 via-background to-background dark:from-indigo-950/20">
      {/* Decorative Glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 to-purple-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Housing & Roommate Matching Platform</span>
            <Badge
              variant="accent"
              className="text-[9px] uppercase px-1.5 py-0"
            >
              Live API
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground leading-[1.15]">
            Find Your Ideal Room &{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Compatible Roommates
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Search verified rental apartments, master bedrooms, and shared flats
            across Dhaka, Chittagong, and major cities with instant Stripe
            checkout & maintenance tracking.
          </p>

          {/* Hero Interactive Search Container */}
          <div className="w-full max-w-3xl mt-4">
            <form
              onSubmit={handleSearch}
              className="p-3 sm:p-4 rounded-3xl border border-border/70 bg-background/80 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left"
            >
              {/* Field 1: Keyword */}
              <div className="flex flex-col gap-1 px-2 py-1 border-b sm:border-b-0 sm:border-r border-border/50">
                <label
                  htmlFor="keyword-input"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
                >
                  <Search className="h-3 w-3 text-indigo-500" /> Keyword
                </label>
                <Input
                  id="keyword-input"
                  type="text"
                  placeholder="e.g. Sunset, Dhanmondi"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 border-none bg-transparent p-0 text-xs focus-visible:ring-0 placeholder:text-muted-foreground/60 shadow-none"
                />
              </div>

              {/* Field 2: City */}
              <div className="flex flex-col gap-1 px-2 py-1 border-b sm:border-b-0 md:border-r border-border/50">
                <label
                  htmlFor="city-select"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3 text-indigo-500" /> City
                </label>
                <select
                  id="city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-8 bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-background text-foreground">
                    All Cities
                  </option>
                  <option
                    value="Dhaka"
                    className="bg-background text-foreground"
                  >
                    Dhaka
                  </option>
                  <option
                    value="Chittagong"
                    className="bg-background text-foreground"
                  >
                    Chittagong
                  </option>
                  <option
                    value="Sylhet"
                    className="bg-background text-foreground"
                  >
                    Sylhet
                  </option>
                  <option
                    value="Rajshahi"
                    className="bg-background text-foreground"
                  >
                    Rajshahi
                  </option>
                </select>
              </div>

              {/* Field 3: Property Type */}
              <div className="flex flex-col gap-1 px-2 py-1 border-b sm:border-b-0 md:border-r border-border/50">
                <label
                  htmlFor="type-select"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
                >
                  <Building className="h-3 w-3 text-indigo-500" /> Type
                </label>
                <select
                  id="type-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-8 bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-background text-foreground">
                    All Types
                  </option>
                  <option
                    value="Apartment"
                    className="bg-background text-foreground"
                  >
                    Apartment
                  </option>
                  <option
                    value="House"
                    className="bg-background text-foreground"
                  >
                    House
                  </option>
                  <option
                    value="Studio"
                    className="bg-background text-foreground"
                  >
                    Studio
                  </option>
                </select>
              </div>

              {/* Field 4: Rent Budget */}
              <div className="flex flex-col gap-1 px-2 py-1 border-b md:border-b-0 md:border-r border-border/50">
                <label
                  htmlFor="budget-select"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
                >
                  <Banknote className="h-3 w-3 text-indigo-500" /> Rent Budget
                </label>
                <select
                  id="budget-select"
                  value={rentBudget}
                  onChange={(e) => setRentBudget(e.target.value)}
                  className="h-8 bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-background text-foreground">
                    Any Budget
                  </option>
                  <option
                    value="under10k"
                    className="bg-background text-foreground"
                  >
                    Under ৳10,000
                  </option>
                  <option
                    value="10k-20k"
                    className="bg-background text-foreground"
                  >
                    ৳10,000 - ৳20,000
                  </option>
                  <option
                    value="above20k"
                    className="bg-background text-foreground"
                  >
                    Above ৳20,000
                  </option>
                </select>
              </div>

              {/* Search Action Button */}
              <div className="flex items-center justify-center pt-1 md:pt-0">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 gap-2"
                >
                  <Search className="h-4 w-4" />
                  Find Rooms
                </Button>
              </div>
            </form>

            {/* Popular quick tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Popular:</span>
              {[
                "Single Room",
                "Master Bedroom",
                "Studio",
                "Dhanmondi",
                "Uttara",
                "Mirpur",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    router.push(`/properties?q=${encodeURIComponent(tag)}`);
                  }}
                  className="rounded-full bg-muted/60 border border-border/50 px-3 py-1 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Key Value Props Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8 border-t border-border/50 max-w-4xl">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">
                  Verified Owners
                </p>
                <p className="text-[10px] text-muted-foreground">
                  100% Identity Checked
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">
                  Instant Booking
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Stripe Payment Gateway
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">
                  Roommate Match
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Compatible Preferences
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">
                  Zero Broker Fee
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Direct Owner Deal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
