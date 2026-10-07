"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
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
import type { AuthResponseData, LoginPayload, Role } from "@/interfaces";
import { getDashboardPath } from "@/lib/auth";
import { useAuth } from "@/providers/auth.provider";
import { forgotPasswordSchema, loginSchema } from "@/validation";

const demoAccounts: {
  role: Role;
  label: string;
  sublabel: string;
  icon: typeof UserCheck;
}[] = [
  {
    role: "ADMIN",
    label: "Admin",
    sublabel: "Platform Moderator",
    icon: ShieldCheck,
  },
  {
    role: "TENANT",
    label: "User / Tenant",
    sublabel: "Find & Rent Rooms",
    icon: UserCheck,
  },
  {
    role: "OWNER",
    label: "Provider / Owner",
    sublabel: "Manage Properties",
    icon: Building2,
  },
];

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<Role | null>(null);
  const [serverError, setServerError] = useState("");

  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleAuthMutation();
  const forgotMutation = useForgotPasswordMutation();
  const demoMutation = useDemoLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    reset: resetForgot,
    formState: { errors: forgotErrors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const finishLogin = (
    response: AuthResponseData,
    fallbackEmail: string,
    fallbackRole: Role,
  ) => {
    const user = response.user || {
      id: `user-${Date.now()}`,
      email: fallbackEmail,
      fullName: fallbackEmail.split("@")[0],
      role: fallbackRole,
      passwordHash: null,
      googleId: null,
      phone: null,
      profileImage: null,
      provider: "CREDENTIAL" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    const token =
      response.token || response.accessToken || `session-${Date.now()}`;

    login(token, user);
    toast.success(`Welcome back, ${user.fullName || "User"}!`);
    router.push(getDashboardPath(user.role));
  };

  const onSubmit = (data: LoginPayload) => {
    setServerError("");
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          finishLogin(response.data, data.email, "TENANT");
        } else {
          setServerError(response.message || "Unable to sign in.");
          toast.error(response.message || "Unable to sign in.");
        }
      },
      onError: (err) => {
        const msg = err.message || "Unable to sign in. Please try again.";
        setServerError(msg);
        toast.error(msg);
      },
    });
  };

  const handleDemoLogin = (role: Role) => {
    setServerError("");
    setActiveDemoRole(role);
    demoMutation.mutate(role, {
      onSuccess: (response) => {
        setActiveDemoRole(null);
        if (response.success && response.data) {
          finishLogin(response.data, `${role.toLowerCase()}@example.com`, role);
        } else {
          setServerError(
            response.message || "Unable to sign in with demo account.",
          );
          toast.error(
            response.message || "Unable to sign in with demo account.",
          );
        }
      },
      onError: (err) => {
        setActiveDemoRole(null);
        const msg = err.message || "Unable to sign in with this demo account.";
        setServerError(msg);
        toast.error(msg);
      },
    });
  };

  const onForgotSubmit = (data: { email: string }) => {
    forgotMutation.mutate(data.email, {
      onSuccess: () => {
        toast.success("Password reset link sent to your email.");
        setShowForgot(false);
        resetForgot();
      },
      onError: (err) => {
        toast.error(err.message || "Unable to request a reset link.");
      },
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
              Access your housing dashboard, bookings, or property management.
            </p>
          </div>

          {/* One-Click Role Login Cards */}
          <div className="mt-6 space-y-2.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-left">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />{" "}
              One-Click Demo Login
            </p>
            <p className="text-[11px] text-muted-foreground">
              Select any role below for instant authenticated access via
              environment-configured test accounts.
            </p>
            <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
              {demoAccounts.map(({ role, label, sublabel, icon: Icon }) => {
                const isThisLoading =
                  demoMutation.isPending && activeDemoRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleDemoLogin(role)}
                    disabled={demoMutation.isPending}
                    className="group flex flex-col items-start gap-1 rounded-xl border border-indigo-500/20 bg-card p-3 text-left transition-all hover:border-indigo-500 hover:bg-indigo-500/10 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-heading text-xs font-semibold text-foreground group-hover:text-indigo-600">
                        {label}
                      </span>
                      {isThisLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                      ) : (
                        <Icon className="h-3.5 w-3.5 text-indigo-500 transition-transform group-hover:scale-110" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {serverError && (
            <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {serverError}
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4 text-left"
          >
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  {...register("email")}
                  placeholder="name@domain.com"
                  className="h-11 rounded-2xl pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-destructive">
                  {errors.email.message}
                </p>
              )}
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
                  {...register("password")}
                  placeholder="Your password"
                  className="h-11 rounded-2xl px-10"
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
              {errors.password && (
                <p className="text-[11px] text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-11 w-full rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loginMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4 ml-1" />
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
                if (credential) {
                  googleMutation.mutate(
                    { idToken: credential },
                    {
                      onSuccess: (response) => {
                        if (response.success && response.data) {
                          finishLogin(
                            response.data,
                            "google-user@example.com",
                            "TENANT",
                          );
                        } else {
                          toast.error(
                            response.message || "Google sign in failed.",
                          );
                        }
                      },
                      onError: (err) => {
                        toast.error(err.message || "Google sign in failed.");
                      },
                    },
                  );
                }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-heading text-lg font-bold">
              Reset your password
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your email address to receive a secure password reset link.
            </p>
            <form
              onSubmit={handleForgotSubmit(onForgotSubmit)}
              className="mt-4 space-y-4"
            >
              <Input
                type="email"
                {...registerForgot("email")}
                placeholder="name@domain.com"
                className="h-10 rounded-xl"
              />
              {forgotErrors.email && (
                <p className="text-[11px] text-destructive">
                  {forgotErrors.email.message}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgot(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {forgotMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send link"
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
