"use client";

import { GoogleLogin } from "@react-oauth/google";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { AuthLottie } from "@/components/auth/auth-lottie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDemoLoginMutation,
  useForgotPasswordMutation,
  useGoogleAuthMutation,
  useLoginMutation,
} from "@/hooks/useAuthMutations";
import type { AuthResponseData, Role } from "@/interfaces";
import { getDashboardPath, setAuthToken } from "@/lib/auth";
import { forgotPasswordSchema, loginSchema } from "@/validation";

const demoAccounts: { role: Role; label: string; icon: typeof UserCheck }[] = [
  { role: "TENANT", label: "Tenant", icon: UserCheck },
  { role: "OWNER", label: "Owner", icon: Building2 },
  { role: "ADMIN", label: "Admin", icon: ShieldCheck },
];

function finishLogin(
  response: AuthResponseData,
  fallbackEmail: string,
  fallbackRole: Role,
  router: ReturnType<typeof useRouter>,
) {
  const user = response.user || {
    id: `user-${Date.now()}`,
    email: fallbackEmail,
    fullName: fallbackEmail.split("@")[0],
    role: fallbackRole,
  };
  setAuthToken(
    response.token || response.accessToken || `session-${Date.now()}`,
    user,
  );
  toast.success(`Welcome back, ${user.fullName || "User"}!`);
  router.push(getDashboardPath(user.role));
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleAuthMutation();
  const forgotMutation = useForgotPasswordMutation();
  const demoMutation = useDemoLoginMutation();

  const signIn = (credentials: {
    email: string;
    password: string;
    role?: Role;
  }) => {
    setError("");
    const result = loginSchema.safeParse(credentials);
    if (!result.success) {
      const message =
        result.error.issues[0]?.message || "Enter a valid email and password.";
      setError(message);
      toast.error(message);
      return;
    }
    loginMutation.mutate(credentials, {
      onSuccess: (response) =>
        response.success && response.data
          ? finishLogin(
              response.data,
              credentials.email,
              credentials.role || "TENANT",
              router,
            )
          : setError(response.message || "Unable to sign in."),
      onError: (mutationError) =>
        setError(
          mutationError.message || "Unable to sign in. Please try again.",
        ),
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn({ email, password });
  };

  const handleDemoLogin = (role: Role) => {
    setError("");
    demoMutation.mutate(role, {
      onSuccess: (response) =>
        response.success && response.data
          ? finishLogin(
              response.data,
              `${role.toLowerCase()}-demo`,
              role,
              router,
            )
          : setError(
              response.message || "Unable to sign in with this demo account.",
            ),
      onError: (mutationError) =>
        setError(
          mutationError.message || "Unable to sign in with this demo account.",
        ),
    });
  };

  const handleForgotPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email: forgotEmail });
    if (!result.success)
      return toast.error(
        result.error.issues[0]?.message || "Enter a valid email.",
      );
    forgotMutation.mutate(forgotEmail, {
      onSuccess: () => {
        toast.success("Password reset link sent.");
        setShowForgot(false);
        setForgotEmail("");
      },
      onError: (mutationError) =>
        toast.error(mutationError.message || "Unable to request a reset link."),
    });
  };

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
      <div className="hidden h-full lg:col-span-5 lg:block">
        <AuthLottie type="login" />
      </div>
      <div className="w-full lg:col-span-7">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="space-y-2 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              UrbanMatch Portal
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your room search, applications, and messages.
            </p>
          </div>
          <div className="mt-6 space-y-2 rounded-2xl border border-border/50 bg-muted/40 p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <UserCheck className="h-3.5 w-3.5 text-indigo-500" /> One-click
              demo login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleDemoLogin(role)}
                  disabled={demoMutation.isPending}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-2 py-2 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@domain.com"
                  className="h-11 rounded-2xl pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  className="h-11 rounded-2xl px-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-11 w-full rounded-2xl bg-indigo-600 text-white"
            >
              {loginMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={({ credential }) => {
                if (credential)
                  googleMutation.mutate(
                    { idToken: credential },
                    {
                      onSuccess: (response) =>
                        response.success && response.data
                          ? finishLogin(
                              response.data,
                              "google-user",
                              "TENANT",
                              router,
                            )
                          : toast.error(
                              response.message || "Google sign in failed.",
                            ),
                      onError: (mutationError) =>
                        toast.error(
                          mutationError.message || "Google sign in failed.",
                        ),
                    },
                  );
              }}
              onError={() => toast.error("Google sign in was cancelled.")}
            />
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl">
            <h2 className="font-heading text-lg font-bold">
              Reset your password
            </h2>
            <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
              <Input
                type="email"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                placeholder="name@domain.com"
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgot(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={forgotMutation.isPending}>
                  Send link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
