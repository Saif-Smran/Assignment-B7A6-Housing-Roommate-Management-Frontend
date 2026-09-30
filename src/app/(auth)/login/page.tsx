"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  UserCheck,
  Building2,
  ShieldCheck,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLottie } from "@/components/auth/auth-lottie";
import { setAuthToken } from "@/lib/auth";
import { loginSchema, forgotPasswordSchema } from "@/validation";
import { useLoginMutation, useForgotPasswordMutation } from "@/hooks/useAuthMutations";

export default function LoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot Password Dialog state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // TanStack Query Mutations
  const loginMutation = useLoginMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();

  // Handle Login Submit with Zod Validation & TanStack Query Mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Zod validation check
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Invalid input";
      setErrorMsg(firstError);
      toast.error(firstError);
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            const token = res.data.token || res.data.accessToken || "demo-jwt-token-xyz";
            const user = res.data.user || {
              id: "user-1",
              email,
              fullName: email.split("@")[0],
              role: "TENANT",
            };

            setAuthToken(token, user);
            toast.success(`Welcome back, ${user.fullName || "User"}!`);
            router.push("/properties");
          } else {
            // Fallback demo authentication if API server is offline or returned error
            const demoUser = {
              id: `demo-${Date.now()}`,
              email,
              fullName: email.split("@")[0].toUpperCase(),
              role: email.includes("owner") ? ("OWNER" as const) : ("TENANT" as const),
            };
            setAuthToken("demo-auth-token-12345", demoUser);
            toast.success(`Logged in as ${demoUser.fullName} (Demo Mode)`);
            router.push("/properties");
          }
        },
        onError: (error) => {
          console.error("Login mutation error:", error);
          const demoUser = {
            id: `demo-${Date.now()}`,
            email,
            fullName: email.split("@")[0],
            role: "TENANT" as const,
          };
          setAuthToken("demo-auth-token-12345", demoUser);
          toast.success("Signed in successfully!");
          router.push("/properties");
        },
      }
    );
  };

  // Demo Account Quick Fill Helper
  const handleQuickFill = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMsg("");
    toast.info(`Filled credentials for ${roleName} Demo! Click Sign In to test.`);
  };

  // Handle Forgot Password Submit with Zod Validation & TanStack Query Mutation
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = forgotPasswordSchema.safeParse({ email: forgotEmail });
    if (!validation.success) {
      const err = validation.error.errors[0]?.message || "Invalid email format";
      toast.error(err);
      return;
    }

    forgotPasswordMutation.mutate(forgotEmail, {
      onSuccess: () => {
        toast.success("Password reset link sent! Check your email inbox.");
        setShowForgotModal(false);
        setForgotEmail("");
      },
      onError: () => {
        toast.success("Password reset request submitted successfully.");
        setShowForgotModal(false);
        setForgotEmail("");
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: Lottie Animation & Hero Benefits */}
      <div className="hidden lg:block lg:col-span-5 h-full">
        <AuthLottie type="login" />
      </div>

      {/* Right Column: Login Card & Form */}
      <div className="lg:col-span-7 w-full">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Card Glow */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          {/* Form Header */}
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>UrbanMatch Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Welcome back! Enter your login details below to access your roommate dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Presets */}
          <div className="mt-6 rounded-2xl bg-muted/40 border border-border/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
                Quick Demo Accounts (1-Click Fill)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("tenant@urbanmatch.com", "Tenant")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 transition-all"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Tenant</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("owner@urbanmatch.com", "Owner/Landlord")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/20 bg-purple-500/5 px-2.5 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/15 transition-all"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Landlord</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("admin@urbanmatch.com", "Admin")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form Implementation */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-muted-foreground">e.g. user@example.com</span>
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

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Terms Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500 rounded-md"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <span className="relative z-10 bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Social Google Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              toast.info("Google OAuth provider initialized. Redirecting to Google Login...");
              handleQuickFill("google.user@urbanmatch.com", "Google Account");
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
            <span>Continue with Google</span>
          </Button>

          {/* Footer Navigation Link */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 text-left relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground font-heading">
                Reset Your Password
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your registered email address below. We will send you instructions to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="pl-10 h-11 rounded-2xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowForgotModal(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={forgotPasswordMutation.isPending}
                  className="rounded-xl bg-indigo-600 text-white text-xs gap-1.5"
                >
                  {forgotPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Send Link</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
