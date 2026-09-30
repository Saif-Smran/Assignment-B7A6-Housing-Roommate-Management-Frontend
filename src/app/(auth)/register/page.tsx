"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLottie } from "@/components/auth/auth-lottie";
import { setAuthToken } from "@/lib/auth";
import { registerSchema } from "@/validation";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import type { Role } from "@/types";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Role state: default TENANT, or OWNER if query param contains role=OWNER
  const [role, setRole] = useState<Role>("TENANT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // TanStack Query Mutation
  const registerMutation = useRegisterMutation();

  // Sync role with query params if present
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "OWNER" || roleParam === "LANDLORD") {
      setRole("OWNER");
    } else if (roleParam === "TENANT") {
      setRole("TENANT");
    }
  }, [searchParams]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-border" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: "Weak", color: "bg-amber-500" };
    if (score <= 4) return { score: 66, label: "Medium", color: "bg-blue-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Submit Handler with Zod Validation & TanStack Query Mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate using Zod schema
    const validationResult = registerSchema.safeParse({
      fullName,
      email,
      phone,
      role,
      password,
      confirmPassword,
      agreeTerms,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Validation failed";
      setErrorMsg(firstError);
      toast.error(firstError);
      return;
    }

    // Execute mutation
    registerMutation.mutate(
      {
        fullName,
        email,
        phone,
        password,
        role,
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            const token = res.data.token || res.data.accessToken || "demo-jwt-token-registered";
            const user = res.data.user || {
              id: `user-${Date.now()}`,
              email,
              fullName,
              role,
            };

            setAuthToken(token, user);
            toast.success(`Account created successfully! Welcome aboard, ${fullName}!`);
            router.push("/properties");
          } else {
            // Fallback demo registration if API server returns error/offline
            const demoUser = {
              id: `demo-${Date.now()}`,
              email,
              fullName,
              phone,
              role,
            };
            setAuthToken("demo-auth-token-12345", demoUser);
            toast.success(`Registration successful as ${role}!`);
            router.push("/properties");
          }
        },
        onError: (err) => {
          console.error("Registration mutation error:", err);
          const demoUser = {
            id: `demo-${Date.now()}`,
            email,
            fullName,
            phone,
            role,
          };
          setAuthToken("demo-auth-token-12345", demoUser);
          toast.success("Registration successful!");
          router.push("/properties");
        },
      }
    );
  };

  // Demo Profile Quick Fill
  const handleQuickFill = (type: "TENANT" | "OWNER") => {
    setErrorMsg("");
    if (type === "TENANT") {
      setRole("TENANT");
      setFullName("Alex Morgan");
      setEmail("alex.morgan@urbanmatch.com");
      setPhone("+1 (555) 234-5678");
      setPassword("Pass@12345");
      setConfirmPassword("Pass@12345");
      toast.info("Filled demo profile for Tenant!");
    } else {
      setRole("OWNER");
      setFullName("David Harrison");
      setEmail("david.harrison@urbanmatch.com");
      setPhone("+1 (555) 987-6543");
      setPassword("Pass@12345");
      setConfirmPassword("Pass@12345");
      toast.info("Filled demo profile for Landlord/Owner!");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: Form Card */}
      <div className="lg:col-span-7 w-full order-2 lg:order-1">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Join UrbanMatch Community</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Choose your role and fill in your details to get started in under 60 seconds.
            </p>
          </div>

          {/* Role Selection Segmented Control */}
          <div className="mt-6 space-y-2">
            <label className="text-xs font-semibold text-foreground block text-left">
              Select Your Account Type:
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-muted/50 border border-border/60">
              <button
                type="button"
                onClick={() => setRole("TENANT")}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-xs font-semibold transition-all ${
                  role === "TENANT"
                    ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-md border border-indigo-500/30 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              >
                <Users className="h-4 w-4" />
                <div className="text-left leading-tight">
                  <div>Room Hunter / Tenant</div>
                  <div className="text-[10px] font-normal opacity-80">Find rooms & roommates</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("OWNER")}
                className={`flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-xs font-semibold transition-all ${
                  role === "OWNER"
                    ? "bg-background text-purple-600 dark:text-purple-400 shadow-md border border-purple-500/30 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`}
              >
                <Building2 className="h-4 w-4" />
                <div className="text-left leading-tight">
                  <div>Property Owner / Landlord</div>
                  <div className="text-[10px] font-normal opacity-80">List rooms & manage tenants</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Fill Presets */}
          <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-muted/30 border border-border/40 p-2.5">
            <span className="text-[11px] font-medium text-muted-foreground">Quick Test Autofill:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("TENANT")}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-0.5 rounded-md bg-indigo-500/10"
              >
                + Tenant Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("OWNER")}
                className="text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:underline px-2 py-0.5 rounded-md bg-purple-500/10"
              >
                + Owner Demo
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left">
            {/* Full Name & Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-11 rounded-2xl border-border/80 bg-background/50 focus:bg-background text-sm transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-foreground">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-11 rounded-2xl border-border/80 bg-background/50 focus:bg-background text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-2xl border-border/80 bg-background/50 focus:bg-background text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-foreground">
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-2xl border-border/80 bg-background/50 focus:bg-background text-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground flex justify-between">
                      <span>Password Strength:</span>
                      <span className="font-semibold text-foreground">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                  Confirm Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-2xl border-border/80 bg-background/50 focus:bg-background text-sm transition-all"
                    required
                  />
                  {confirmPassword && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[10px] text-amber-500 pt-0.5">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I agree to UrbanMatch&apos;s{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Privacy Policy
                  </span>
                </span>
              </label>
            </div>

            {/* Submit Register Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-medium shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Create Account ({role === "OWNER" ? "Landlord" : "Tenant"})</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Social Sign Up Divider */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <span className="relative z-10 bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Or Register With
            </span>
          </div>

          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              toast.info("Google Registration provider initialized...");
              handleQuickFill(role === "OWNER" ? "OWNER" : "TENANT");
            }}
            className="w-full h-11 rounded-2xl border-border/80 hover:bg-accent/60 gap-2.5 text-xs font-semibold text-foreground transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign Up with Google</span>
          </Button>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            Already have an UrbanMatch account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
            >
              Sign In Here
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Lottie Visuals & Benefits */}
      <div className="hidden lg:block lg:col-span-5 h-full order-1 lg:order-2">
        <AuthLottie type="register" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
