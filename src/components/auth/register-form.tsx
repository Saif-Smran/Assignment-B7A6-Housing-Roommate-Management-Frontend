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
  Phone,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthLottie } from "@/components/auth/auth-lottie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGoogleAuthMutation,
  useRegisterMutation,
} from "@/hooks/useAuthMutations";
import type { AuthResponseData, Role } from "@/interfaces";
import { getDashboardPath } from "@/lib/auth";
import { useAuth } from "@/providers/auth.provider";
import { type RegisterSchemaType, registerSchema } from "@/validation";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const registerMutation = useRegisterMutation();
  const googleMutation = useGoogleAuthMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      role: "TENANT",
      password: "",
      confirmPassword: "",
      agreeTerms: true,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    const requestedRole = searchParams.get("role");
    if (requestedRole === "OWNER" || requestedRole === "LANDLORD") {
      setValue("role", "OWNER");
    } else if (requestedRole === "TENANT") {
      setValue("role", "TENANT");
    }
  }, [searchParams, setValue]);

  const finishRegister = (
    response: AuthResponseData,
    email: string,
    fullName: string,
    role: Role,
  ) => {
    const user = response.user || {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role,
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
    toast.success(`Welcome to UrbanMatch, ${fullName}!`);
    router.push(getDashboardPath(user.role));
  };

  const onSubmit = (data: RegisterSchemaType) => {
    setServerError("");
    registerMutation.mutate(
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            finishRegister(response.data, data.email, data.fullName, data.role);
          } else {
            setServerError(
              response.message || "Unable to create your account.",
            );
            toast.error(response.message || "Unable to create your account.");
          }
        },
        onError: (err) => {
          const msg = err.message || "Unable to create your account.";
          setServerError(msg);
          toast.error(msg);
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
      <div className="order-2 w-full lg:order-1 lg:col-span-7">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="space-y-2 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Join UrbanMatch
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your role and start exploring or managing verified
              listings.
            </p>
          </div>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "TENANT")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-semibold transition-all ${
                selectedRole === "TENANT"
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 shadow-sm"
                  : "border-border text-muted-foreground hover:border-border/80"
              }`}
            >
              <Users className="h-4 w-4" />
              Tenant (User)
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "OWNER")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-semibold transition-all ${
                selectedRole === "OWNER"
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 shadow-sm"
                  : "border-border text-muted-foreground hover:border-border/80"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Owner (Provider)
            </button>
          </div>
          {errors.role && (
            <p className="mt-1 text-[11px] text-destructive">
              {errors.role.message}
            </p>
          )}

          {serverError && (
            <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {serverError}
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 space-y-4 text-left"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="register-name"
                  className="text-xs font-semibold"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-name"
                    {...register("fullName")}
                    placeholder="Jane Doe"
                    className="h-11 rounded-2xl pl-10"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="register-phone"
                  className="text-xs font-semibold"
                >
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    {...register("phone")}
                    placeholder="+880 1700 000000"
                    className="h-11 rounded-2xl pl-10"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-xs font-semibold">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-email"
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="text-xs font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="At least 6 characters"
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

              <div className="space-y-1.5">
                <label
                  htmlFor="register-confirm"
                  className="text-xs font-semibold"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-confirm"
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Confirm your password"
                    className="h-11 rounded-2xl pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="register-terms"
                type="checkbox"
                {...register("agreeTerms")}
                className="mt-1 h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="register-terms"
                className="text-xs text-muted-foreground"
              >
                I agree to the{" "}
                <Link href="/faq" className="text-indigo-600 underline">
                  Terms of Service
                </Link>{" "}
                and Privacy Policy.
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-[11px] text-destructive">
                {errors.agreeTerms.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="h-11 w-full rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or sign up with
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={({ credential }) => {
                if (credential) {
                  googleMutation.mutate(
                    { idToken: credential, role: selectedRole },
                    {
                      onSuccess: (response) => {
                        if (response.success && response.data) {
                          finishRegister(
                            response.data,
                            "google-user@example.com",
                            "Google User",
                            selectedRole,
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div className="order-1 hidden h-full lg:order-2 lg:col-span-5 lg:block">
        <AuthLottie type="register" />
      </div>
    </div>
  );
}
