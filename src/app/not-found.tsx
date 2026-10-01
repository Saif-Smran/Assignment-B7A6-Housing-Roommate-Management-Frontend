import { ArrowLeft, ArrowRight, Compass, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.28),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(20,184,166,0.18),transparent_32%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <section className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-indigo-200 shadow-2xl shadow-indigo-950/40 backdrop-blur-sm">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="font-heading text-sm font-semibold uppercase tracking-[0.28em] text-indigo-300">
          UrbanMatch / 404
        </p>
        <h1 className="mt-5 font-heading text-5xl font-bold tracking-tight sm:text-7xl">
          This room is empty.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
          The page you are looking for has moved, been booked, or never existed.
          Let&apos;s get you back to a place that feels like home.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full gap-2 rounded-full bg-white px-6 text-slate-950 hover:bg-indigo-50 sm:w-auto"
          >
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              Go home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full gap-2 rounded-full border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <Link href="/properties">
              <Search className="h-4 w-4" aria-hidden="true" />
              Browse properties
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Return to the previous page
        </Link>
      </section>
    </main>
  );
}
