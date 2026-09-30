"use client";

import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import { ShieldCheck, Sparkles, Users, Key, Building, CheckCircle2 } from "lucide-react";

// Modern vector-driven Lottie JSON data for Login (Security, Keys & Urban Housing)
const loginLottieData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 500,
  h: 500,
  nm: "Login Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Key Shield Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [250, 250, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100], e: [105, 105, 100] },
            { t: 60, s: [105, 105, 100], e: [90, 90, 100] },
            { t: 120, s: [90, 90, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [320, 320] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.38, 0.4, 0.96, 1] },
              w: 4,
              lc: 2,
              lj: 2
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              s: { a: 0, k: [100, 100] }
            }
          ]
        }
      ]
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Glowing House Icon",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [250, 240, 0], e: [250, 260, 0] },
            { t: 60, s: [250, 260, 0], e: [250, 240, 0] },
            { t: 120, s: [250, 240, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sr",
              sy: 1,
              p: { a: 0, k: [0, -20] },
              pt: { a: 0, k: 3 },
              r: { a: 0, k: 120 },
              ir: { a: 0, k: 60 },
              or: { a: 0, k: 120 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.49, 0.36, 0.95, 1] }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              s: { a: 0, k: [100, 100] }
            }
          ]
        }
      ]
    }
  ]
};

// Modern vector-driven Lottie JSON data for Registration (Roommate Match & City Building)
const registerLottieData = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 500,
  h: 500,
  nm: "Register Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Outer Pulse Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [-360] },
            { t: 120, s: [-360] }
          ]
        },
        p: { a: 0, k: [250, 250, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [85, 85, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100], e: [85, 85, 100] },
            { t: 120, s: [85, 85, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [340, 340] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.93, 0.28, 0.6, 1] },
              w: 3,
              lc: 2,
              lj: 2
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              s: { a: 0, k: [100, 100] }
            }
          ]
        }
      ]
    }
  ]
};

import type { AuthLottieProps } from "@/interfaces";


export function AuthLottie({ type }: AuthLottieProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLogin = type === "login";

  return (
    <div className="relative flex flex-col items-center justify-center p-8 lg:p-12 h-full min-h-[460px] overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-background/90 border border-white/10 backdrop-blur-xl shadow-2xl group">
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl group-hover:bg-indigo-600/30 transition-all duration-700 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl group-hover:bg-purple-600/30 transition-all duration-700 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      {/* Main Lottie / Animated Visual Section */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm flex flex-col items-center">
        {mounted ? (
          <div className="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-[0_20px_50px_rgba(99,102,241,0.25)] transition-transform duration-500 hover:scale-105">
            <Lottie
              src={isLogin ? loginLottieData : registerLottieData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center rounded-2xl bg-indigo-500/10 animate-pulse">
            <Building className="h-16 w-16 text-indigo-400 opacity-60" />
          </div>
        )}

        {/* Floating Custom Hero Badge */}
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/15 text-xs font-semibold text-white shadow-lg animate-bounce">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{isLogin ? "Welcome Back to UrbanMatch!" : "Join 15,000+ Room Hunters!"}</span>
        </div>

        {/* Dynamic Descriptive Text */}
        <div className="mt-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
            {isLogin
              ? "Find Your Ideal Living Space"
              : "Create Your Roommate Profile"}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
            {isLogin
              ? "Access verified room listings, manage booking applications, and chat directly with verified hosts."
              : "Discover compatible roommates, list your properties with zero commission fees, and book room viewings."}
          </p>
        </div>

        {/* Floating Feature Badges Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/5 p-3 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:border-indigo-500/30">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              {isLogin ? <ShieldCheck className="h-4 w-4" /> : <Users className="h-4 w-4" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">
                {isLogin ? "Verified Hosts" : "Smart Matching"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isLogin ? "100% Background Checked" : "AI Compatibility Score"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-white/5 p-3 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:border-purple-500/30">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              {isLogin ? <Key className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">
                {isLogin ? "Secure Access" : "Zero Hidden Fees"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isLogin ? "256-bit Encrypted Session" : "Transparent Pricing"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
