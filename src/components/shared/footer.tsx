import {
  ArrowRight,
  Building2,
  Code2,
  Globe,
  Heart,
  Mail,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-muted/30 pt-16 pb-8 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-border/60">
          {/* Brand & Description (2 columns on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                  Urban
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Match
                  </span>
                </span>
                <span className="text-[10px] font-medium text-muted-foreground -mt-1">
                  Housing & Roommate Management Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The premier platform connecting tenants with verified rental
              properties, rooms, and compatible roommates with seamless Stripe
              payments and maintenance tracking.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/60 border border-border/40 px-3 py-1.5 rounded-full">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Verified Listings</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/60 border border-border/40 px-3 py-1.5 rounded-full">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>

          {/* Column 1: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Browse Properties & Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Dashboards & Roles */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
              User Dashboards
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Tenant Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/owner"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Property Owner Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Admin Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Demo Credentials Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register?role=OWNER"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Newsletter */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
              Stay Connected
            </h4>
            <p className="text-xs text-muted-foreground">
              Subscribe for new property listings and roommate matching alerts
              in Dhaka & major cities.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1.5">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 text-xs rounded-xl bg-background border-border"
                />
                <Button
                  size="sm"
                  className="h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-[10px] text-muted-foreground">
                No spam ever. Unsubscribe at any time.
              </span>
            </div>

            <div className="pt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>Dhanmondi, Dhaka 1205, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>support@urbanmatch-b7a6.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1 text-center sm:text-left">
            © {new Date().getFullYear()} UrbanMatch Platform (B7A6 Assignment).
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />{" "}
            using Next.js & Tailwind CSS.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/faq"
              className="hover:text-foreground transition-colors"
            >
              Terms & Privacy
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Help Desk
            </Link>
            <div className="flex items-center gap-2.5 pl-2 border-l border-border">
              <a
                href="https://github.com/Saif-Smran/Assignment-B7A6-Housing-Roommate-Management-backend"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                aria-label="GitHub Repository"
              >
                <Code2 className="h-4 w-4" />
              </a>
              <a
                href="https://b7-a6.vercel.app/api"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                aria-label="API Endpoint"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
