import { Lock, Search, ShieldCheck, Sparkles, Users2, Zap } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | UrbanMatch Housing & Roommate Platform",
  description:
    "Learn about UrbanMatch's mission to modernize shared housing, verified listings, and secure roommate connections across Bangladesh.",
};

export default function AboutPage() {
  const values = [
    {
      icon: ShieldCheck,
      title: "100% Verified Listings",
      desc: "Every flat, master bedroom, and landlord identity is verified to eliminate middlemen, fraud, and deceptive rental photos.",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      icon: Lock,
      title: "Secure Digital Payments",
      desc: "Integrated with Stripe Checkout for seamless, receipted rent and security deposit transactions with automated records.",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      icon: Users2,
      title: "Compatible Roommate Matching",
      desc: "Empowering students and professionals to find like-minded roommates based on lifestyle, cleanliness, and budget preferences.",
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
    },
    {
      icon: Zap,
      title: "Direct Maintenance Tracking",
      desc: "Digital ticketing system that lets tenants log repairs directly to property owners with real-time status updates.",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
  ];

  const team = [
    {
      name: "Saif Smran",
      role: "Founder & Lead Architect",
      bio: "Full-stack engineer dedicated to solving urban housing transparency and rental workflows in developing ecosystems.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Ayesha Rahman",
      role: "Head of Community & Trust",
      bio: "Advocating for tenant safety, roommate background verification, and seamless onboarding experiences.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Tanvir Ahmed",
      role: "Director of Property Operations",
      bio: "Partnering with landlords and property management teams across Dhaka, Chittagong, and Sylhet.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const milestones = [
    {
      year: "2024",
      event:
        "UrbanMatch ideated to solve unverified flat rentals & deposit fraud in Dhaka.",
    },
    {
      year: "2025",
      event:
        "Launched beta platform with verified owner onboarding & room-level listings.",
    },
    {
      year: "2026",
      event:
        "Integrated automated Stripe payments, maintenance workflows, and multi-city rollouts.",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Header Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-indigo-50/60 via-background to-background dark:from-indigo-950/20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-indigo-500/15 to-purple-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Our Story & Mission</span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground leading-tight">
            Transforming How People{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Live & Share Spaces
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            UrbanMatch was built to remove the anxiety, hidden broker fees, and
            uncertainty from finding a home and living with roommates. We
            connect genuine people with verified living spaces.
          </p>
        </div>
      </section>

      {/* 2. Platform Story & Mission Grid */}
      <section className="py-16 md:py-20 bg-background border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Narrative */}
            <div className="space-y-6">
              <Badge
                variant="accent"
                className="text-xs px-3 py-1 font-semibold uppercase tracking-wider"
              >
                Why We Exist
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Ending the Frustration of Urban Room Hunting
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Finding a safe room or a reliable roommate in busy
                  metropolitan areas has historically been fraught with
                  middlemen, inaccurate photos, unrecorded cash deposits, and
                  unpredictable flatmates.
                </p>
                <p>
                  We created UrbanMatch as an all-in-one housing ecosystem.
                  Property owners gain a powerful dashboard to manage rooms,
                  screen applicants, and collect rent securely. Renters gain
                  verified photos, transparent pricing, instant viewing
                  scheduling, and dedicated maintenance tracking.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-indigo-600 dark:text-indigo-400">
                    100%
                  </span>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    Verified Landlords & Direct Communication
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-purple-600 dark:text-purple-400">
                    0 ৳
                  </span>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    Hidden Brokerage Fees for Renters
                  </p>
                </div>
              </div>
            </div>

            {/* Right Media Display */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border/60">
              <Image
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                alt="Modern shared living room"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-heading font-bold text-lg">
                  Safe, Transparent, Connected Living
                </p>
                <p className="text-xs text-zinc-200">
                  Bringing accountability and peace of mind to modern rentals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <Badge
              variant="outline"
              className="text-xs px-3 py-1 font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
            >
              Our Core Principles
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              What Sets UrbanMatch Apart
            </h2>
            <p className="text-sm text-muted-foreground">
              Every feature on our platform is guided by trust, security, and
              making housing accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <Card
                  key={val.title}
                  className="rounded-3xl border border-border/60 bg-card p-6 space-y-3 hover:border-indigo-500/40 hover:shadow-lg transition-all"
                >
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center ${val.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {val.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {val.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Journey & Milestones */}
      <section className="py-20 bg-background border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <Badge
              variant="accent"
              className="text-xs px-3 py-1 font-semibold uppercase tracking-wider"
            >
              Growth & Vision
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Our Platform Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="p-6 rounded-3xl border border-border/60 bg-card/60 relative overflow-hidden space-y-2 hover:border-indigo-500/30 transition-all"
              >
                <div className="inline-block font-heading font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">
                  {m.year}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team Section */}
      <section className="py-20 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <Badge
              variant="outline"
              className="text-xs px-3 py-1 font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 border-purple-500/30"
            >
              The People Behind The Platform
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Meet Our Leadership
            </h2>
            <p className="text-sm text-muted-foreground">
              Passionate builders focused on creating safer rental communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <Card
                key={member.name}
                className="overflow-hidden rounded-3xl border border-border/60 bg-card hover:border-indigo-500/30 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[4/3] w-full bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardContent className="p-6 space-y-2 text-left">
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {member.role}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section className="py-16 md:py-20 bg-background border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 sm:p-12 md:p-16 text-white shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-5">
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Ready to Experience Transparent Housing?
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Browse through hundreds of verified master bedrooms, studio
                flats, and roommate listings now.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl bg-white text-indigo-700 hover:bg-zinc-100 font-bold text-sm shadow-lg gap-2"
                >
                  <Link href="/properties">
                    <Search className="h-4 w-4" />
                    Explore Available Listings
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-sm backdrop-blur-md"
                >
                  <Link href="/contact">Contact Our Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
