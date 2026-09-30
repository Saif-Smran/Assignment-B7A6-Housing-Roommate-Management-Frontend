import { ArrowLeft, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication | UrbanMatch Housing & Roommates",
  description:
    "Sign in or create an account on UrbanMatch to find rooms, list properties, and match with roommates.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Decorative Background Mesh & Grid Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all">
            <Building2 className="h-5.5 w-5.5 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Urban
              <span className="text-indigo-600 dark:text-indigo-400">
                Match
              </span>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground -mt-1">
              Housing & Roommates
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border transition-all shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl">{children}</div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-20 py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} UrbanMatch Housing Inc. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
