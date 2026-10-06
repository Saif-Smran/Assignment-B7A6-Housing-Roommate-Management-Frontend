import {
  ArrowRight,
  Building2,
  Compass,
  CreditCard,
  KeyRound,
  Search,
  ShieldCheck,
  Sparkles,
  Users2,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getProperties } from "@/api/properties.api";
import { HomeHero } from "@/components/home/home-hero";
import { PropertyCard } from "@/components/room/property-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PropertyDetails } from "@/interfaces";

export const metadata: Metadata = {
  title: "UrbanMatch | Premium Housing & Roommate Management Platform",
  description:
    "Find your ideal room, verified apartment, and compatible roommates. Enjoy seamless Stripe checkout, viewing requests, and direct maintenance management.",
};

export default async function HomePage() {
  const res = await getProperties({ limit: 6 });
  const featuredProperties: PropertyDetails[] =
    res.success && res.data?.items ? res.data.items : [];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Featured Properties Section */}
      <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Handpicked Listings</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Featured Properties & Rooms
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Explore top-rated verified rental accommodations with attached
                amenities, transparent pricing, and instant booking
                availability.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full gap-2 text-xs font-medium self-start md:self-auto border-border hover:bg-background"
            >
              <Link href="/properties">
                Browse All Properties
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Properties Grid */}
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            /* Empty State / Fallback */
            <div className="rounded-3xl border border-dashed border-border/80 bg-background/50 p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  Connecting to Property Network...
                </h3>
                <p className="text-xs text-muted-foreground">
                  New verified rooms are being synced with the database. You can
                  explore all available properties directly.
                </p>
              </div>
              <Button
                asChild
                className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
              >
                <Link href="/properties">Explore All Rooms</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Stats Highlight Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6 text-center space-y-2 hover:border-indigo-500/30 transition-all">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
                500+
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Verified Listings
              </h4>
              <p className="text-xs text-muted-foreground">
                Inspected apartments and rooms
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 text-center space-y-2 hover:border-indigo-500/30 transition-all">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-purple-600 dark:text-purple-400">
                1,200+
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Active Tenants
              </h4>
              <p className="text-xs text-muted-foreground">
                Happy renters and roommates
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 text-center space-y-2 hover:border-indigo-500/30 transition-all">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">
                99.2%
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Payment Success
              </h4>
              <p className="text-xs text-muted-foreground">
                Automated Stripe checkout
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 text-center space-y-2 hover:border-indigo-500/30 transition-all">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-amber-600 dark:text-amber-400">
                &lt; 24h
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Viewing Confirmation
              </h4>
              <p className="text-xs text-muted-foreground">
                Rapid owner response time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-20 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <Badge
              variant="accent"
              className="text-xs px-3 py-1 font-semibold uppercase tracking-wider"
            >
              Simple 3-Step Process
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              How UrbanMatch Works
            </h2>
            <p className="text-sm text-muted-foreground">
              Whether you are looking for a cozy bedroom or listing your
              investment property, we make the entire process effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Tenants */}
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent p-8 sm:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    For Tenants & Roommates
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Find, visit, and book in 3 steps
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      Discover & Filter Rooms
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Filter listings by city, rent budget, room type, and
                      amenities tailored to your lifestyle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      Schedule Viewing or Apply
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Request in-person or virtual property viewings and submit
                      your booking application with move-in dates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      Pay with Stripe & Move In
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Once the owner approves, pay security deposit and rent
                      securely via Stripe test gateway.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs"
              >
                <Link href="/properties">Start Searching Rooms</Link>
              </Button>
            </div>

            {/* For Property Owners */}
            <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-8 sm:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    For Property Owners
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    List flats, manage rooms & collect payments
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
                  <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      List with 4-Step Wizard
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Add property basics, amenities, room specifications, rent
                      amounts, and photos in minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
                  <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      Screen & Approve Applicants
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Review tenant profiles, manage viewing requests, and
                      accept or reject applications in one click.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
                  <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      Automated Rent & Maintenance
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Receive instant payouts via Stripe, assign rooms, and
                      resolve maintenance tickets smoothly.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                variant="secondary"
                className="w-full rounded-2xl font-medium text-xs border border-purple-500/20"
              >
                <Link href="/register?role=OWNER">
                  Register as Property Owner
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Platform Features */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <Badge
              variant="outline"
              className="text-xs px-3 py-1 font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
            >
              Why Choose UrbanMatch
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Everything You Need for Peace of Mind
            </h2>
            <p className="text-sm text-muted-foreground">
              Built specifically to eliminate rental hassles, protect your
              money, and connect genuine roommates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-3xl border border-border/60 bg-card p-6 space-y-3 hover:border-indigo-500/40 hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Verified Landlords & Rooms
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All property owners and listings are verified to prevent scams,
                fake photos, and unauthorized brokerages.
              </p>
            </Card>

            <Card className="rounded-3xl border border-border/60 bg-card p-6 space-y-3 hover:border-indigo-500/40 hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Stripe Payment Gateway
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pay rent, security deposit, and utilities with full card
                security, automated digital invoices, and receipts.
              </p>
            </Card>

            <Card className="rounded-3xl border border-border/60 bg-card p-6 space-y-3 hover:border-indigo-500/40 hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Roommate Preferences
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Match with compatible flatmates based on lifestyle, budget,
                capacity, and clean living expectations.
              </p>
            </Card>

            <Card className="rounded-3xl border border-border/60 bg-card p-6 space-y-3 hover:border-indigo-500/40 hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Digital Maintenance Tickets
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submit repairs and plumbing issues right from your dashboard and
                track technician resolution progress in real time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Call To Action (CTA) Banner */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 sm:p-12 md:p-16 text-white shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white/90">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ready to start your journey?</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Find Your Next Home or Rent Out Your Vacant Space Today
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                Join hundreds of tenants and property owners who manage room
                bookings, rent collections, and maintenance seamlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl bg-white text-indigo-700 hover:bg-zinc-100 font-bold text-sm shadow-lg gap-2"
                >
                  <Link href="/properties">
                    <Search className="h-4 w-4" />
                    Browse Available Rooms
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-sm backdrop-blur-md"
                >
                  <Link href="/login">Sign In </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
