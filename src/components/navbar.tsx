"use client";

import {
  Building2,
  HelpCircle,
  Home,
  Info,
  LogIn,
  Menu,
  PhoneCall,
  PlusCircle,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Browse Rooms", icon: Search },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/contact", label: "Contact", icon: PhoneCall },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all">
            <Building2 className="h-5.5 w-5.5 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                Urban
                <span className="text-indigo-600 dark:text-indigo-400">
                  Match
                </span>
              </span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground -mt-1 hidden sm:inline-block">
              Housing & Roommates
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 p-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-medium gap-1.5 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full"
          >
            <Link href="/login">
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs font-medium gap-1.5 rounded-full border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400"
          >
            <Link href="/register">
              <UserPlus className="h-3.5 w-3.5" />
              Register
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="text-xs font-medium gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-600/20"
          >
            <Link href="/register?role=OWNER">
              <PlusCircle className="h-3.5 w-3.5" />
              Post a Room
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="rounded-full text-foreground"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5 px-4 pt-3 pb-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
              Navigation
            </p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-border/60 flex flex-col gap-2">
              <Button
                asChild
                size="sm"
                className="w-full justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/register?role=OWNER">
                  <PlusCircle className="h-4 w-4" />
                  Post a Room / List Property
                </Link>
              </Button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-1.5 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/login">
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center gap-1.5 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/register">
                    <UserPlus className="h-3.5 w-3.5" />
                    Register
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
